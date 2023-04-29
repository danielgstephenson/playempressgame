import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlaying from '../guard/current/player'
import { playersRef, profilesRef } from '../db'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { Choice, Game, PlayResult, Player, Result, SchemeProps, SchemeRef } from '../types'
import { arrayUnion, deleteField, increment } from 'firelord'
import createHistoryUpdate from '../create/historyUpdate'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import passTime from '../passTime'
import guardEffect from '../guard/effect'
import guardSchemes from '../guard/schemes'
import serializeSchemes from '../serialize/schemes'
import getHighestRankScheme from '../get/highestRankScheme'
import getJoined from '../get/joined'
import getAllPlayers from '../get/allPlayers'
import guardPlayHandSchemes from '../guard/playHandSchemes'
import serializeScheme from '../serialize/scheme'
import getEffectResultChanges from '../get/effectResultChanges'

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
  const {
    passedTimeline,
    timeEvent
  } = passTime({
    allPlayers,
    currentPlayerId,
    timeline: currentGame.timeline
  })
  const gameSummons: SchemeRef[] = []
  const gameChoices: Choice[] = []
  function play (result: Result<Player>): PlayResult {
    const current = result.id === currentPlayerId
    const lastEvent = current ? youEvent : createEvent(`${currentPlayer.displayName} is ready.`)
    const trashScheme = guardHandScheme({ hand: result.hand, schemeId: result.trashScheme?.id, label: 'Playing trash scheme' })
    const playScheme = guardHandScheme({ hand: result.hand, schemeId: result.playScheme?.id, label: 'Playing play scheme' })
    const playSchemeRef = serializeScheme(playScheme)
    const playedHand = result.hand.filter((scheme) => scheme.id !== trashScheme.id && scheme.id !== playScheme.id)
    const effect = guardEffect(playScheme.rank)
    const deck = guardSchemes({ refs: result.deck })
    const discard = guardSchemes({ refs: result.discard })
    const hand = guardSchemes({ refs: playedHand })
    const dungeon = guardSchemes({ refs: currentGame.dungeon })
    const effectResult = effect({
      summons: [],
      choices: [],
      deck,
      discard,
      dungeon,
      gold: result.gold,
      passedTimeline,
      hand,
      playerId: result.id,
      playSchemeRef,
      playSchemes,
      silver: result.silver
    })
    const changes = getEffectResultChanges({
      deck,
      discard,
      effectResult,
      gold: result.gold,
      hand,
      silver: result.silver
    })
    gameSummons.push(...changes.effectSummons)
    gameChoices.push(...changes.effectChoices)

    const playEvent = createEvent(`You played scheme ${playScheme.rank}.`, changes.effectPlayerEvents)

    const playerEvents = [
      lastEvent,
      createEvent('Everyone is ready.'),
      createEvent(`You trashed scheme ${trashScheme.rank}.`),
      timeEvent,
      playEvent
    ]

    return {
      playerResult: result,
      playerEvents,
      playerChanges: changes.playerChanges,
      profileChanges: changes.profileChanges
    }
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
          label: 'Potential imprison play scheme'
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
          const oldHand = playResult.playerChanges.hand
          playResult.playerChanges.hand = oldHand.filter(scheme => scheme.rank !== high?.rank)
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
