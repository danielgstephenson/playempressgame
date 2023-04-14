import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/currentPlayer'
import guardDocData from '../guard/docData'
import { gamesRef, playersRef, profilesRef } from '../db'
import { https } from 'firebase-functions/v1'
import { createEvent } from '../create/event'
import { PlayReadyProps, Player } from '../types'
import { arrayUnion, deleteField, increment, query, where } from 'firelord'
import createHistoryUpdate from '../create/historyUpdate'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../updatePlayers'

const playReady = createCloudFunction<PlayReadyProps>(async (props, context, transaction) => {
  const { currentUid, playerData, playerRef, playerId, profileRef } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  const gameRef = gamesRef.doc(props.gameId)
  const gameData = await guardDocData({
    docRef: gameRef,
    transaction
  })
  if (playerData.trashId == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This player has not trashed a scheme.'
    )
  }
  if (playerData.playId == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This player has not played a scheme.'
    )
  }
  console.log(`Setting ${currentUid} ready...`)
  const realReadyCount = gameData.readyCount + 1
  const waiting = realReadyCount < gameData.userIds.length
  const youEvent = createEvent('You are ready.')
  const youUpdate = createHistoryUpdate(youEvent)
  if (waiting) {
    const displayNameUpdate = createEventUpdate(`${playerData.displayName} is ready.`)
    transaction.update(gameRef, {
      readyCount: increment(1),
      ...displayNameUpdate
    })
    updateOtherPlayers({
      currentUid,
      gameId:
      props.gameId,
      transaction,
      userIds: gameData.userIds,
      update: displayNameUpdate
    })
    transaction.update(playerRef, youUpdate)
    transaction.update(profileRef, { ready: true })
    return
  }
  const whereGameId = where('gameId', '==', props.gameId)
  const whereUserId = where('userId', '!=', currentUid)
  const otherPlayersQuery = query(playersRef.collection(), whereGameId, whereUserId)
  const otherPlayers = await transaction.get(otherPlayersQuery)
  const otherPlayersData: Array<Player['read'] & { id: string }> = []
  otherPlayers.forEach(otherPlayer => {
    const otherPlayerData = otherPlayer.data()
    otherPlayersData.push({
      id: otherPlayer.id,
      ...otherPlayerData
    })
  })
  const currentPlayer = { id: playerId, ...playerData }
  const allPlayersData = [...otherPlayersData, currentPlayer]
  const publicEvents = allPlayersData.map(player => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playId, label: 'Play scheme'
    })
    return {
      id: player.id,
      event: createEvent(`${player.displayName} played scheme ${playScheme.rank}.`)
    }
  })
  function play ({ data: playData, id }: {
    data: any
    id: string
  }): void {
    const playerRef = playersRef.doc(id)
    const current = id === playerId
    const lastEvent = current ? youEvent : createEvent(`${playerData.displayName} is ready.`)
    const playEvents = publicEvents.filter(event => event.id !== id).map(event => event.event)
    const trashScheme = guardHandScheme({ hand: playData.hand, schemeId: playData.trashId, label: 'Trash scheme' })
    const playScheme = guardHandScheme({ hand: playData.hand, schemeId: playData.playId, label: 'Play scheme' })
    transaction.update(playerRef, {
      hand: playData.hand.filter((scheme: any) => scheme.id !== playData.trashId),
      trashId: deleteField(),
      history: arrayUnion(
        lastEvent,
        createEvent('Everyone is ready.'),
        createEvent(`You trashed scheme ${trashScheme.rank}.`),
        ...playEvents,
        createEvent(`You played scheme ${playScheme.rank}.`)
      )
    })
    const profileRef = profilesRef.doc(id)
    transaction.update(profileRef, {
      ready: false,
      trashEmpty: true
    })
  }
  otherPlayers.forEach(otherPlayer => {
    play({ data: otherPlayer.data(), id: otherPlayer.id })
  })
  play({ data: playerData, id: playerId })
  transaction.update(gameRef, {
    history: arrayUnion(
      createEvent('Everyone is ready.')
    ),
    readyCount: 0
  })
  console.log(`${currentUid} is ready!`)
})
export default playReady
