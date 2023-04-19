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
import guardSchemes from '../guard/schemes'
import isChanged from '../is/changed'
import serializeSchemes from '../serialize/schemes'
import serializeEffect from '../serialize/effect'

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
    const effectResult = effect({
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
    const {
      effectAppointments,
      effectChoices,
      effectDeck,
      effectDiscard,
      effectGold,
      effectHand,
      effectPlayerEvents
    } = serializeEffect(effectResult)
    gameAppointments.push(...effectAppointments)
    gameChoices.push(...effectChoices)
    const playerChanges: Partial<Player['write']> = {
      hand: effectHand
    }
    const profileChanges: Partial<Profile['writeFlatten']> = {}
    const deckedChanged = isChanged(deck, effectDeck)
    if (deckedChanged) {
      playerChanges.deck = effectDeck
    }
    const discardChanged = isChanged(discard, effectDiscard)
    if (discardChanged) {
      playerChanges.discard = effectDiscard
    }
    const effectTop = effectDiscard[effectDiscard.length - 1]
    const resultTop = discard[discard.length - 1]
    const topdiscardChanged = effectTop?.id !== resultTop?.id
    if (topdiscardChanged) {
      profileChanges.topDiscardScheme = effectTop ?? deleteField()
    }
    const goldChanged = effectGold !== result.gold
    if (goldChanged) {
      playerChanges.gold = effectGold
      profileChanges.gold = effectGold
    }
    const time = guardTime(playScheme.rank)
    const playerUpdate = {
      trashId: deleteField(),
      history: arrayUnion(
        lastEvent,
        createEvent('Everyone is ready.'),
        createEvent(`You trashed scheme ${trashScheme.rank}.`),
        ...playEvents,
        createEvent(`You played scheme ${playScheme.rank} with ${time} time.`),
        timeEvent,
        ...effectPlayerEvents
      ),
      ...playerChanges
    }
    console.log('playerUpdate test:', playerUpdate)
    transaction.update(playerRef, playerUpdate)

    const profileUpdate = {
      ...profileChanges,
      ready: true,
      trashEmpty: false
    }
    transaction.update(profileRef, profileUpdate)
  }
  allPlayers.forEach(play)
  const passedRefs = serializeSchemes(passedTimeline)
  const gameChanges: Partial<Game['write']> = {
    history: arrayUnion(
      createEvent('Everyone is ready.')
    ),
    timeline: passedRefs,
    readyCount: 0
  }
  if (gameAppointments.length > 0) {
    const refs = gameAppointments
    gameChanges.court = arrayUnion(...refs)
  }
  if (gameChoices.length > 0) {
    gameChanges.choices = arrayUnion(...gameChoices)
  }
  transaction.update(currentGameRef, gameChanges)
  console.info(`${currentUid} is ready!`)
})
export default playReady
