import { https } from 'firebase-functions/v1'
import guardJoinPhase from '../guard/joinPhase'
import createCloudFunction from '../create/cloudFunction'
import createRange from '../create/range'
import { playersRef } from '../db'
import createScheme from '../create/scheme'
import createEvent from '../create/event'
import guardCurrentGame from '../guard/current/game'
import { arrayUnion } from 'firelord'
import guardDefined from '../guard/defined'
import guardSchemeData from '../guard/schemeData'
import isGreen from '../is/green'
import isRed from '../is/red'
import isYellow from '../is/yellow'
import { GameProps } from '../types'
import getJoined from '../get/joined'
import guardString from '../guard/string'
import addEvent from '../add/event'
import { OBSERVER_CHOOSE_MESSAGE, PLAYER_CHOOSE_MESSAGE } from '../constants'

const startGame = createCloudFunction<GameProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Start game id')
  console.info(`Starting game ${gameId}...`)
  const { currentGameData, currentGameRef } = await guardCurrentGame({
    context,
    gameId,
    transaction
  })
  if (currentGameData.profiles.length < 2) {
    throw new https.HttpsError(
      'failed-precondition',
      'This game does not have enough players.'
    )
  }
  guardJoinPhase({ gameData: currentGameData })
  const foundProfile = currentGameData
    .profiles
    .find(profile => profile.userId === context.auth?.uid)
  const currentProfile = guardDefined(foundProfile, 'Current profile')
  const startMessage = `${currentProfile.displayName} started game ${gameId}.`
  const startEvent = createEvent(startMessage)
  const range = createRange(26) // [0..25]
  const separated = [1, 7]
  const rangeSeparated = range.filter(rank => !separated.includes(rank))
  const randomRange = range.map(() => Math.random())
  const shuffled = [...rangeSeparated].sort((aRank, bRank) => {
    const randomA = randomRange[aRank] as number
    const randomB = randomRange[bRank] as number
    return randomA - randomB
  })
  const shuffledRanks = getJoined(shuffled)
  addEvent(startEvent, `Shuffled schemes 0 and 2 through 25: ${shuffledRanks}`)
  const empressSize = 13 + currentGameData.profiles.length
  addEvent(startEvent, `The empress size is ${empressSize}, 13 plus the ${currentGameData.profiles.length} players.`)
  const empressSlice = shuffled.slice(0, empressSize)
  const sorted = [...empressSlice].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const sortedRanks = getJoined(sorted)
  addEvent(startEvent, `Dealt and sorted ${empressSize} schemes in a row: ${sortedRanks}.`)
  const court = guardDefined(sorted[0], 'Court')
  addEvent(startEvent, `The lowest rank scheme, ${court}, is summoned to the court.`)
  const dungeon = guardDefined(sorted[1], 'Dungeon')
  addEvent(startEvent, `The next lowest rank scheme, ${dungeon}, is imprisoned in the dungeon.`)
  const palaceSlice = sorted.slice(2)
  const empressGreen = palaceSlice.filter(rank => isGreen(guardSchemeData(rank)))
  const empressGreenRanks = getJoined(empressGreen)
  addEvent(startEvent, `The remaining green schemes are ${empressGreenRanks}.`)
  const empressRed = palaceSlice.filter(rank => isRed(guardSchemeData(rank)))
  const empressRedRanks = getJoined(empressRed)
  addEvent(startEvent, `The remaining red schemes are ${empressRedRanks}.`)
  const empressYellow = palaceSlice.filter(rank => isYellow(guardSchemeData(rank)))
  const empressYellowRanks = getJoined(empressYellow)
  addEvent(startEvent, `The remaining yellow schemes are ${empressYellowRanks}.`)
  const lowYellow = empressYellow.slice(0, 1)
  const lowestYellow = lowYellow[0]
  if (lowestYellow == null) {
    addEvent(startEvent, 'There are no yellow schemes remaining.')
  } else {
    addEvent(startEvent, `The lowest remaining yellow scheme is ${lowestYellow}.`)
  }
  const lowGreen = empressGreen.slice(0, 2)
  if (lowGreen.length === 0) {
    addEvent(startEvent, 'There are no green schemes remaining.')
  } else if (lowGreen.length === 1) {
    const lowRank = String(lowGreen[0])
    addEvent(startEvent, `The only remaining green scheme is ${lowRank}.`)
  } else {
    const lowRanks = getJoined(lowGreen)
    addEvent(startEvent, `The two lowest remaining green schemes are ${lowRanks}.`)
  }
  const lowRed = empressRed.slice(0, 2)
  if (lowRed.length === 0) {
    addEvent(startEvent, 'There are no red schemes remaining.')
  } else if (lowRed.length === 1) {
    const lowRank = String(lowRed[0])
    addEvent(startEvent, `The only remaining red scheme is ${lowRank}.`)
  } else {
    const lowRanks = getJoined(lowRed)
    addEvent(startEvent, `The two lowest remaining red schemes are ${lowRanks}.`)
  }
  const basePortfolio = [7, ...lowGreen, ...lowRed]
  if (lowestYellow != null) {
    basePortfolio.push(lowestYellow)
  }
  const empressLeft = palaceSlice.filter(rank => !basePortfolio.includes(rank))
  const lowestLeft = guardDefined(empressLeft[0], 'Lowest left')
  addEvent(startEvent, `The lowest remaining scheme is ${lowestLeft}.`)
  const portfolio = [...basePortfolio, lowestLeft]
  const sortedPortfolio = [...portfolio].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const portfolioRanks = getJoined(sortedPortfolio)
  addEvent(startEvent, `The portfolio is ${portfolioRanks}.`)
  const courtScheme = createScheme(court)
  const dungeonScheme = createScheme(dungeon)
  const deckIndex = sortedPortfolio.length - 2
  const topDeck = guardDefined(sortedPortfolio[deckIndex], 'Top deck')
  addEvent(startEvent, `The top deck scheme is ${topDeck}.`)
  // const discardIndex = sortedPortfolio.length - 1
  const topDiscard = 14 // guardDefined(sortedPortfolio[discardIndex], 'Top discard')
  addEvent(startEvent, `The top discard scheme is ${topDiscard}.`)
  const hand = sortedPortfolio.slice(0, sortedPortfolio.length - 2)
  hand[0] = 1
  hand[1] = 5
  hand[2] = 14
  hand[3] = 14
  hand[4] = 15
  addEvent(startEvent, `The hand is ${getJoined(hand)}.`)
  const timeline = empressLeft.slice(1)
  const timelineRanks = getJoined(timeline)
  addEvent(startEvent, `The timeline is ${timelineRanks}.`)
  const timelineSchemes = timeline.map(rank => createScheme(rank))
  const startedProfiles = currentGameData.profiles.map((profile) => {
    const chooseEvent = createEvent(PLAYER_CHOOSE_MESSAGE)
    const topDeckScheme = createScheme(topDeck)
    const topDiscardScheme = createScheme(topDiscard)
    const deck = [topDeckScheme, createScheme(14), createScheme(14), createScheme(14), createScheme(14)]
    const discard = [topDiscardScheme]
    const handSchemes = hand.map(rank => createScheme(rank))
    const playerData = {
      auctionReady: false,
      bid: 0,
      deck,
      discard,
      displayName: profile.displayName,
      events: [...currentGameData.events, startEvent, chooseEvent],
      gameId,
      gold: 40,
      hand: handSchemes,
      lastBidder: false,
      playReady: false,
      silver: 0,
      tableau: [],
      trashHistory: [],
      userId: profile.userId,
      withdrawn: false
    }
    const playerId = `${profile.userId}_${gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.set(playerRef, playerData, { merge: true })
    return {
      ...profile,
      topDiscardScheme,
      deckEmpty: false,
      gold: 40
    }
  })
  const observerChooseEvent = createEvent(OBSERVER_CHOOSE_MESSAGE)
  transaction.update(currentGameRef, {
    court: [courtScheme],
    dungeon: [dungeonScheme],
    events: arrayUnion(startEvent, observerChooseEvent),
    phase: 'play',
    profiles: startedProfiles,
    timeline: timelineSchemes
  })
  console.info(`Started game with id ${gameId}!`)
})
export default startGame
