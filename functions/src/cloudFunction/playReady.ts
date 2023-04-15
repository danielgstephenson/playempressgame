import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/current/player'
import { playersRef, profilesRef } from '../db'
import { https } from 'firebase-functions/v1'
import { createEvent } from '../create/event'
import { PlayReadyProps, Player, Result } from '../types'
import { arrayUnion, deleteField, increment, query, where } from 'firelord'
import createHistoryUpdate from '../create/historyUpdate'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import getQuery from '../getQuery'
import passTime from '../passTime'
import guardTime from '../guard/time'
import guardEffect from '../guard/effect'

const playReady = createCloudFunction<PlayReadyProps>(async (props, context, transaction) => {
  const {
    currentGameRef,
    currentGameData,
    currentUid,
    currentPlayer,
    currentPlayerData,
    currentPlayerRef,
    currentPlayerId,
    currentProfileRef
  } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  if (currentPlayerData.trashId == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This player has not trashed a scheme.'
    )
  }
  if (currentPlayerData.playId == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This player has not played a scheme.'
    )
  }
  console.log(`Setting ${currentUid} ready...`)
  const realReadyCount = currentGameData.readyCount + 1
  const waiting = realReadyCount < currentGameData.users.length
  const youEvent = createEvent('You are ready.')
  const youUpdate = createHistoryUpdate(youEvent)
  if (waiting) {
    console.log('waiting')
    const displayNameUpdate = createEventUpdate(`${currentPlayerData.displayName} is ready.`)
    transaction.update(currentGameRef, {
      readyCount: increment(1),
      ...displayNameUpdate
    })
    updateOtherPlayers({
      currentUid,
      gameId:
      props.gameId,
      transaction,
      users: currentGameData.users,
      update: displayNameUpdate
    })
    transaction.update(currentPlayerRef, youUpdate)
    transaction.update(currentProfileRef, { ready: true })
    return
  }
  console.log('not waiting')
  const whereGameId = where('gameId', '==', props.gameId)
  const whereUserId = where('userId', '!=', currentUid)
  const otherPlayersQuery = query(playersRef.collection(), whereGameId, whereUserId)
  const otherPlayers = await getQuery({ query: otherPlayersQuery, transaction })
  const allPlayers = [...otherPlayers, currentPlayer]
  const publicEvents = allPlayers.map(player => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playId, label: 'Play scheme'
    })
    const time = guardTime(playScheme.rank)
    return {
      id: player.id,
      event: createEvent(`${player.displayName} played scheme ${playScheme.rank} with ${time} time.`)
    }
  })
  const {
    passedTimeline,
    timeEvent
  } = passTime({
    allPlayers,
    gameRef: currentGameRef,
    timeline: currentGameData.timeline,
    transaction
  })

  function play (result: Result<Player>): void {
    console.log('playing', result)
    const playerRef = playersRef.doc(result.id)
    const current = result.id === currentPlayerId
    const lastEvent = current ? youEvent : createEvent(`${currentPlayerData.displayName} is ready.`)
    const playEvents = publicEvents.filter(event => event.id !== result.id).map(event => event.event)
    const trashScheme = guardHandScheme({ hand: result.hand, schemeId: result.trashId, label: 'Trash scheme' })
    const playScheme = guardHandScheme({ hand: result.hand, schemeId: result.playId, label: 'Play scheme' })
    const playedHand = result.hand.filter((scheme) => scheme.id !== trashScheme.id && scheme.id !== playScheme.id)

    const time = guardTime(playScheme.rank)
    transaction.update(playerRef, {
      trashId: deleteField(),
      history: arrayUnion(
        lastEvent,
        createEvent('Everyone is ready.'),
        createEvent(`You trashed scheme ${trashScheme.rank}.`),
        ...playEvents,
        createEvent(`You played scheme ${playScheme.rank} with ${time} time.`),
        timeEvent
      )
    })
    const effect = guardEffect(playScheme.rank)
    effect({
      allPlayers,
      currentPlayer,
      gameData: currentGameData,
      gameRef: currentGameRef,
      hand: playedHand,
      passedTimeline,
      playerRef,
      transaction
    })

    const profileRef = profilesRef.doc(result.id)
    transaction.update(profileRef, {
      ready: false,
      trashEmpty: true
    })
  }
  allPlayers.forEach(play)
  console.log('updating game')
  transaction.update(currentGameRef, {
    history: arrayUnion(
      createEvent('Everyone is ready.')
    ),
    timeline: passedTimeline,
    readyCount: 0
  })
  console.log(`${currentUid} is ready!`)
})
export default playReady
