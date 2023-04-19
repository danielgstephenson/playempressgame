import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/current/player'
import { playersRef, profilesRef } from '../db'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { Choice, Game, PlayReadyProps, Player, Profile, Result, SchemeRef } from '../types'
import { arrayUnion, deleteField, increment, query, where } from 'firelord'
import createHistoryUpdate from '../create/historyUpdate'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import getQuery from '../getQuery'
import passTime from '../passTime'
import guardTime from '../guard/time'
import guardEffect from '../guard/effect'
import guardScheme from '../guard/scheme'
import guardSchemes from '../guard/schemes'

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
  console.info(`Setting ${currentUid} ready...`)
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
  const realReadyCount = currentGameData.readyCount + 1
  const waiting = realReadyCount < currentGameData.users.length
  const youEvent = createEvent('You are ready.')
  const youUpdate = createHistoryUpdate(youEvent)
  if (waiting) {
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
  const whereGameId = where('gameId', '==', props.gameId)
  const whereUserId = where('userId', '!=', currentUid)
  const otherPlayersQuery = query(playersRef.collection(), whereGameId, whereUserId)
  const otherPlayers = await getQuery({ query: otherPlayersQuery, transaction })
  const allPlayers = [...otherPlayers, currentPlayer]
  const playSchemes = allPlayers.map(player => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playId, label: 'Play scheme'
    })
    return playScheme
  })
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
  const gameAppointments: SchemeRef[] = []
  const gameChoices: Choice[] = []
  function play (result: Result<Player>): void {
    const playerRef = playersRef.doc(result.id)
    const current = result.id === currentPlayerId
    const lastEvent = current ? youEvent : createEvent(`${currentPlayerData.displayName} is ready.`)
    const playEvents = publicEvents.filter(event => event.id !== result.id).map(event => event.event)
    const trashScheme = guardHandScheme({ hand: result.hand, schemeId: result.trashId, label: 'Trash scheme' })
    const playScheme = guardHandScheme({ hand: result.hand, schemeId: result.playId, label: 'Play scheme' })
    const playedHand = result.hand.filter((scheme) => scheme.id !== trashScheme.id && scheme.id !== playScheme.id)
    const profileRef = profilesRef.doc(result.id)
    const effect = guardEffect(playScheme.rank)
    const deck = guardSchemes({ refs: result.deck })
    const discard = guardSchemes({ refs: result.discard })
    const hand = guardSchemes({ refs: playedHand })
    const dungeon = guardSchemes({ refs: currentGameData.dungeon })
    const {
      appointments,
      choices,
      deck: effectDeck,
      discard: effectDiscard,
      gold,
      hand: effectHand,
      playerEvents
    } = effect({
      appointments: [],
      choices: [],
      deck,
      discard,
      dungeon,
      gold: result.gold,
      passedTimeline,
      hand,
      playerId: result.id,
      playSchemes
    })
    gameAppointments.push(...appointments)
    gameChoices.push(...choices)
    const playerChanges: Partial<Player['write']> = { hand }
    const profileChanges: Partial<Profile['writeFlatten']> = {}
    const deckedChanged = effectDeck.length !== result.deck.length || effectDeck.some((scheme, index) => scheme.id !== result.deck[index]?.id)
    if (deckedChanged) {
      playerChanges.deck = effectDeck
    }
    const discardChanged = discard.length !== result.discard.length || discard.some((scheme, index) => scheme.id !== result.discard[index]?.id)
    if (discardChanged) {
      playerChanges.discard = discard
    }
    const topdiscardChanged = discard[discard.length - 1]?.id !== result.discard[result.discard.length - 1]?.id
    if (topdiscardChanged) {
      profileChanges.topDiscardScheme = discard[discard.length - 1] ?? deleteField()
    }
    const goldChanged = gold !== result.gold
    if (goldChanged) {
      playerChanges.gold = gold
      profileChanges.gold = gold
    }
    const time = guardTime(playScheme.rank)
    transaction.update(playerRef, {
      trashId: deleteField(),
      history: arrayUnion(
        lastEvent,
        createEvent('Everyone is ready.'),
        createEvent(`You trashed scheme ${trashScheme.rank}.`),
        ...playEvents,
        createEvent(`You played scheme ${playScheme.rank} with ${time} time.`),
        timeEvent,
        ...playerEvents
      ),
      ...playerChanges
    })

    const profileUpdate = {
      ...profileChanges,
      ready: true,
      trashEmpty: false
    }
    transaction.update(profileRef, profileUpdate)
  }
  allPlayers.forEach(play)
  const gameChanges: Partial<Game['write']> = {
    history: arrayUnion(
      createEvent('Everyone is ready.')
    ),
    timeline: passedTimeline,
    readyCount: 0
  }
  if (gameAppointments.length > 0) {
    gameChanges.court = arrayUnion(...gameAppointments)
  }
  if (gameChoices.length > 0) {
    gameChanges.choices = arrayUnion(...gameChoices)
  }
  transaction.update(currentGameRef, gameChanges)
  console.info(`${currentUid} is ready!`)
})
export default playReady
