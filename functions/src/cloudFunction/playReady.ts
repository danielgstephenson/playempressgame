import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlaying from '../guard/current/player'
import { playersRef, profilesRef } from '../db'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { Choice, Game, PlayResult, Player, Profile, Result, SchemeProps, SchemeRef } from '../types'
import { arrayUnion, deleteField, increment } from 'firelord'
import createHistoryUpdate from '../create/historyUpdate'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import passTime from '../passTime'
import guardTime from '../guard/time'
import guardEffect from '../guard/effect'
import guardSchemes from '../guard/schemes'
import isChanged from '../is/changed'
import serializeSchemes from '../serialize/schemes'
import serializeEffect from '../serialize/effect'
import getHighestRankScheme from '../get/highestRankScheme'
import getJoined from '../get/joined'
import getAllPlayers from '../get/allPlayers'
import guardPlayHandSchemes from '../guard/playHandSchemes'

const playReady = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  const {
    currentGameRef,
    currentGame,
    currentUid,
    currentPlayer,
    currentPlayerRef,
    currentPlayerId,
    currentProfileRef
  } = await guardCurrentPlaying({
    gameId: props.gameId,
    transaction,
    context
  })
  console.info(`Setting ${currentUid} ready...`)
  if (currentPlayer.trashScheme == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This player has not trashed a scheme.'
    )
  }
  if (currentPlayer.playScheme == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This player has not played a scheme.'
    )
  }
  const realReadyCount = currentGame.readyCount + 1
  const waiting = realReadyCount < currentGame.users.length
  const youEvent = createEvent('You are ready.')
  const youUpdate = createHistoryUpdate(youEvent)
  if (waiting) {
    console.log('waiting')
    const displayNameUpdate = createEventUpdate(`${currentPlayer.displayName} is ready.`)
    transaction.update(currentGameRef, {
      readyCount: increment(1),
      ...displayNameUpdate
    })
    updateOtherPlayers({
      currentUid,
      gameId:
      props.gameId,
      transaction,
      users: currentGame.users,
      update: displayNameUpdate
    })
    transaction.update(currentPlayerRef, youUpdate)
    transaction.update(currentProfileRef, { ready: true })
    return
  }
  console.log('not waiting')
  const allPlayers = await getAllPlayers({
    currentPlayer,
    gameId: props.gameId,
    transaction
  })
  const playSchemes = guardPlayHandSchemes(allPlayers)
  const publicEvents = allPlayers.map(player => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playScheme?.id, label: 'Play scheme'
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
    timeline: currentGame.timeline
  })
  const gameSummons: SchemeRef[] = []
  const gameChoices: Choice[] = []
  function play (result: Result<Player>): PlayResult {
    const current = result.id === currentPlayerId
    const lastEvent = current ? youEvent : createEvent(`${currentPlayer.displayName} is ready.`)
    const playEvents = publicEvents.filter(event => event.id !== result.id).map(event => event.event)
    const trashScheme = guardHandScheme({ hand: result.hand, schemeId: result.trashScheme?.id, label: 'Trash scheme' })
    const playScheme = guardHandScheme({ hand: result.hand, schemeId: result.playScheme?.id, label: 'Play scheme' })
    const playedHand = result.hand.filter((scheme) => scheme.id !== trashScheme.id && scheme.id !== playScheme.id)
    const effect = guardEffect(playScheme.rank)
    const deck = guardSchemes({ refs: result.deck })
    const discard = guardSchemes({ refs: result.discard })
    const hand = guardSchemes({ refs: playedHand })
    const dungeon = guardSchemes({ refs: currentGame.dungeon })
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
      playSchemes,
      silver: result.silver
    })
    const {
      effectAppointments,
      effectChoices,
      effectDeck,
      effectDiscard,
      effectGold,
      effectSilver,
      effectHand,
      effectPlayerEvents
    } = serializeEffect(effectResult)
    gameSummons.push(...effectAppointments)
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
    const silverChanged = effectSilver !== result.silver
    if (silverChanged) {
      playerChanges.silver = effectSilver
      profileChanges.silver = effectSilver
    }
    const time = guardTime(playScheme.rank)

    const playerEvents = [
      lastEvent,
      createEvent('Everyone is ready.'),
      createEvent(`You trashed scheme ${trashScheme.rank}.`),
      ...playEvents,
      createEvent(`You played scheme ${playScheme.rank} with ${time} time.`),
      timeEvent,
      ...effectPlayerEvents
    ]

    return { playerResult: result, playerEvents, playerChanges, profileChanges }
  }
  const playResults = allPlayers.map(play)
  const timelineRefs = serializeSchemes(passedTimeline)
  const gameEvents = [createEvent('Everyone is ready.')]
  const gameImprisons: SchemeRef[] = []
  if (gameChoices.length === 0) {
    const high = getHighestRankScheme(playSchemes)
    if (high == null) {
      throw new Error('No highest rank scheme.')
    }
    const highRank = String(high?.rank)
    const highEvent = createEvent(`The highest rank scheme in play is ${highRank}.`)
    const highs = playSchemes.filter(scheme => scheme.rank === high?.rank)
    if (highs.length > 1) {
      const imprisonedPlayResults = playResults.filter(result => {
        const scheme = guardHandScheme({
          hand: result.playerResult.hand,
          schemeId: result.playerResult.playScheme?.id,
          label: 'Play scheme'
        })
        return scheme.rank === high?.rank
      })
      const displayNames = imprisonedPlayResults.map(player => player.playerResult.displayName)
      const joined = getJoined(displayNames)
      const publicEvent = createEvent(`The ${highRank} played by ${joined} are imprisoned in the dungeon.`)
      gameEvents.push(publicEvent)
      gameImprisons.push(...highs)
      playResults.forEach(playResult => {
        playResult.playerEvents.push(highEvent)
        const imprisoned = imprisonedPlayResults
          .some(imprisonedPlayResult => imprisonedPlayResult.playerResult.id === playResult.playerResult.id)
        if (imprisoned) {
          const otherImprisoned = imprisonedPlayResults.filter(imprisonedPlayResult => {
            return imprisonedPlayResult.playerResult.id !== playResult.playerResult.id
          })
          const otherDisplayNames = otherImprisoned.map(player => player.playerResult.displayName)
          const privateDisplayNames = ['You', ...otherDisplayNames]
          const privateJoined = getJoined(privateDisplayNames)
          const rank = otherDisplayNames.length === 1 ? highRank : `${highRank}s`
          const privateEvent = createEvent(`${privateJoined} imprison your ${rank} in the dungeon.`)
          playResult.playerEvents.push(privateEvent)
          if (!Array.isArray(playResult.playerChanges.hand)) {
            throw new Error('Hand is not an array.')
          }
          playResult.playerChanges.hand = playResult
            .playerChanges
            .hand
            .filter(scheme => scheme.id !== high?.id)
        } else {
          playResult.playerEvents.push(publicEvent)
        }
      })
    } else {
      const summonee = playResults.find(result => result.playerResult.playScheme?.id === high?.id)
      const displayName = String(summonee?.playerResult.displayName)
      const publicEvent = createEvent(`The ${highRank} played by ${displayName} is summoned to the court.`)
      gameEvents.push(publicEvent)
      gameSummons.push(high)
      playResults.forEach(result => {
        result.playerEvents.push(highEvent)
        const summoned = result.playerResult.playScheme?.id === high?.id
        if (summoned) {
          const privateEvent = createEvent(`Your ${highRank} is summoned to the court.`)
          result.playerEvents.push(privateEvent)
          if (!Array.isArray(result.playerChanges.hand)) {
            throw new Error('Hand is not an array.')
          }
          result.playerChanges.hand = result.playerChanges.hand.filter(scheme => scheme.id !== high?.id)
        } else {
          result.playerEvents.push(publicEvent)
        }
      })
    }
  }
  playResults.forEach(result => {
    const { playerResult, playerEvents, playerChanges, profileChanges } = result
    const playerRef = playersRef.doc(playerResult.id)
    const profileRef = profilesRef.doc(playerResult.id)
    const playerUpdate = {
      ...playerChanges,
      trashScheme: deleteField(),
      history: arrayUnion(...playerEvents)
    }
    console.log('playerChanges', playerUpdate)
    transaction.update(playerRef, playerUpdate)
    const profileUpdate = {
      ...profileChanges,
      ready: false,
      trashEmpty: true
    }
    console.log('profileChanges', profileUpdate)
    transaction.update(profileRef, profileUpdate)
  })
  const gameChanges: Partial<Game['write']> = {
    history: arrayUnion(
      createEvent('Everyone is ready.'),
      ...gameEvents
    ),
    timeline: timelineRefs,
    readyCount: 0
  }
  if (gameSummons.length > 0) {
    const refs = serializeSchemes(gameSummons)
    gameChanges.court = arrayUnion(...refs)
  }
  if (gameImprisons.length > 0) {
    const refs = serializeSchemes(gameImprisons)
    gameChanges.dungeon = arrayUnion(...refs)
  }
  if (gameChoices.length > 0) {
    gameChanges.choices = arrayUnion(...gameChoices)
  }
  transaction.update(currentGameRef, gameChanges)
  console.info(`${currentUid} is ready!`)
})
export default playReady
