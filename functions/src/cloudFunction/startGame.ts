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
  const startEvent = createEvent(`${currentProfile.displayName} started game ${gameId}.`)
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
  startEvent.children.push(createEvent(`Shuffled schemes 0 and 2 through 25: ${shuffledRanks}`))
  const empressSize = 13 + currentGameData.profiles.length
  startEvent.children.push(createEvent(`The empress size is ${empressSize}, 13 plus the ${currentGameData.profiles.length} players.`))
  const empressSlice = shuffled.slice(0, empressSize)
  const sorted = [...empressSlice].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const sortedRanks = getJoined(sorted)
  startEvent.children.push(createEvent(`Dealt and sorted ${empressSize} schemes in a row: ${sortedRanks}.`))
  const court = guardDefined(sorted[0], 'Court')
  startEvent.children.push(createEvent(`The lowest rank scheme, ${court}, is summoned to the court.`))
  const dungeon = guardDefined(sorted[1], 'Dungeon')
  startEvent.children.push(createEvent(`The next lowest rank scheme, ${dungeon}, is imprisoned in the dungeon.`))
  const palaceSlice = sorted.slice(2)
  const empressGreen = palaceSlice.filter(rank => isGreen(guardSchemeData(rank)))
  const empressGreenRanks = getJoined(empressGreen)
  startEvent.children.push(createEvent(`The remaining green schemes are ${empressGreenRanks}.`))
  const empressRed = palaceSlice.filter(rank => isRed(guardSchemeData(rank)))
  const empressRedRanks = getJoined(empressRed)
  startEvent.children.push(createEvent(`The remaining red schemes are ${empressRedRanks}.`))
  const empressYellow = palaceSlice.filter(rank => isYellow(guardSchemeData(rank)))
  const empressYellowRanks = getJoined(empressYellow)
  startEvent.children.push(createEvent(`The remaining yellow schemes are ${empressYellowRanks}.`))
  const lowYellow = empressYellow.slice(0, 1)
  const lowestYellow = lowYellow[0]
  if (lowestYellow == null) {
    startEvent.children.push(createEvent('There are no yellow schemes remaining.'))
  } else {
    startEvent.children.push(createEvent(`The lowest remaining yellow scheme is ${lowestYellow}.`))
  }
  const lowGreen = empressGreen.slice(0, 2)
  if (lowGreen.length === 0) {
    startEvent.children.push(createEvent('There are no green schemes remaining.'))
  } else if (lowGreen.length === 1) {
    const lowRank = String(lowGreen[0])
    startEvent.children.push(createEvent(`The only remaining green scheme is ${lowRank}.`))
  } else {
    const lowRanks = getJoined(lowGreen)
    startEvent.children.push(createEvent(`The two lowest remaining green schemes are ${lowRanks}.`))
  }
  const lowRed = empressRed.slice(0, 2)
  if (lowRed.length === 0) {
    startEvent.children.push(createEvent('There are no red schemes remaining.'))
  } else if (lowRed.length === 1) {
    const lowRank = String(lowRed[0])
    startEvent.children.push(createEvent(`The only remaining red scheme is ${lowRank}.`))
  } else {
    const lowRanks = getJoined(lowRed)
    startEvent.children.push(createEvent(`The two lowest remaining red schemes are ${lowRanks}.`))
  }
  const basePortfolio = [7, ...lowGreen, ...lowRed]
  if (lowestYellow != null) {
    basePortfolio.push(lowestYellow)
  }
  const empressLeft = palaceSlice.filter(rank => !basePortfolio.includes(rank))
  const lowestLeft = guardDefined(empressLeft[0], 'Lowest left')
  startEvent.children.push(createEvent(`The lowest remaining scheme is ${lowestLeft}.`))
  const portfolio = [...basePortfolio, lowestLeft]
  const sortedPortfolio = [...portfolio].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const portfolioRanks = getJoined(sortedPortfolio)
  startEvent.children.push(createEvent(`The portfolio is ${portfolioRanks}.`))
  const courtScheme = createScheme(court)
  const dungeonScheme = createScheme(dungeon)
  const deckIndex = sortedPortfolio.length - 2
  const topDeck = guardDefined(sortedPortfolio[deckIndex], 'Top deck')
  startEvent.children.push(createEvent(`The top deck scheme is ${topDeck}.`))
  // const discardIndex = sortedPortfolio.length - 1
  const topDiscard = 16 // guardDefined(sortedPortfolio[discardIndex], 'Top discard')
  startEvent.children.push(createEvent(`The top discard scheme is ${topDiscard}.`))
  const hand = sortedPortfolio.slice(0, sortedPortfolio.length - 2)
  hand[2] = 1
  hand[3] = 11
  hand[4] = 16
  startEvent.children.push(createEvent(`The hand is ${getJoined(hand)}.`))
  const timeline = empressLeft.slice(1)
  const timelineRanks = getJoined(timeline)
  startEvent.children.push(createEvent(`The timeline is ${timelineRanks}.`))
  const timelineSchemes = timeline.map(rank => createScheme(rank))
  const startedProfiles = currentGameData.profiles.map((profile) => {
    const topDeckScheme = createScheme(topDeck)
    const topDiscardScheme = createScheme(topDiscard)
    const deck = [topDeckScheme]
    const discard = [topDiscardScheme]
    const handSchemes = hand.map(rank => createScheme(rank))
    const playerData = {
      deck,
      discard,
      displayName: profile.displayName,
      gameId,
      gold: 40,
      hand: handSchemes,
      history: [...currentGameData.history, startEvent],
      ready: false,
      silver: 0,
      trashHistory: [],
      userId: profile.userId
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
  transaction.update(currentGameRef, {
    court: [courtScheme],
    dungeon: [dungeonScheme],
    history: arrayUnion(startEvent),
    phase: 'play',
    profiles: startedProfiles,
    timeline: timelineSchemes
  })
  console.info(`Started game with id ${gameId}!`)
})
export default startGame
