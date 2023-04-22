import { https } from 'firebase-functions/v1'
import guardJoinPhase from '../guard/joinPhase'
import createCloudFunction from '../create/cloudFunction'
import createRange from '../create/range'
import { playersRef, profilesRef, usersRef } from '../db'
import createSchemeRef from '../create/schemeRef'
import createEvent from '../create/event'
import guardCurrentGame from '../guard/current/game'
import { arrayUnion, documentId, query, where } from 'firelord'
import guardDefined from '../guard/defined'
import getQuery from '../get/query'
import guardSchemeData from '../guard/schemeData'
import isGreen from '../is/green'
import isRed from '../is/red'
import isYellow from '../is/yellow'
import { GameProps } from '../types'
import getJoined from '../get/joined'

const startGame = createCloudFunction<GameProps>(async (props, context, transaction) => {
  console.info(`Starting game ${props.gameId}...`)
  const { currentGameData, currentGameRef } = await guardCurrentGame({
    context,
    gameId: props.gameId,
    transaction
  })
  if (currentGameData.users.length < 2) {
    throw new https.HttpsError(
      'failed-precondition',
      'This game does not have enough players.'
    )
  }
  guardJoinPhase({ gameData: currentGameData })
  const idField = documentId()
  const currentUserIds = currentGameData.users.map(user => user.id)
  const whereId = where(idField, 'in', currentUserIds)
  const currentUsersQuery = query(usersRef.collection(), whereId)
  const users = await getQuery({ query: currentUsersQuery, transaction })
  const currentUser = guardDefined(users.find(user => user.id === context.auth?.uid), 'Current user')
  const startEvent = createEvent(`${currentUser.displayName} started game ${props.gameId}.`)
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
  const empressSize = 13 + currentGameData.users.length
  startEvent.children.push(createEvent(`The empress size is ${empressSize}, 13 plus the ${currentGameData.users.length} players.`))
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
    startEvent.children.push(createEvent(`The only remaining yellow scheme is ${lowestYellow}.`))
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
  const timeline = empressLeft.slice(1)
  const timelineRanks = getJoined(timeline)
  startEvent.children.push(createEvent(`The timeline is ${timelineRanks}.`))
  const timelineSchemes = timeline.map(rank => createSchemeRef(rank))
  const courtScheme = createSchemeRef(court)
  const dungeonScheme = createSchemeRef(dungeon)
  const sortedPortfolio = [...portfolio].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const portfolioRanks = getJoined(sortedPortfolio)
  startEvent.children.push(createEvent(`The portfolio is ${portfolioRanks}.`))
  const deckIndex = sortedPortfolio.length - 2
  const topDeck = guardDefined(sortedPortfolio[deckIndex], 'Top deck')
  startEvent.children.push(createEvent(`The top deck scheme is ${topDeck}.`))
  const discardIndex = sortedPortfolio.length - 1
  const topDiscard = guardDefined(sortedPortfolio[discardIndex], 'Top discard')
  startEvent.children.push(createEvent(`The top discard scheme is ${topDiscard}.`))
  const hand = sortedPortfolio.slice(0, sortedPortfolio.length - 2)
  startEvent.children.push(createEvent(`The hand is ${getJoined(hand)}.`))
  transaction.update(currentGameRef, {
    phase: 'play',
    court: [courtScheme],
    dungeon: [dungeonScheme],
    timeline: timelineSchemes,
    history: arrayUnion(startEvent)
  })
  users.forEach((user) => {
    const topDeckScheme = createSchemeRef(topDeck)
    const topDiscardScheme = createSchemeRef(topDiscard)
    const deck = [topDeckScheme]
    const discard = [topDiscardScheme]
    const handSchemes = hand.map(rank => createSchemeRef(rank))
    const playerData = {
      userId: user.id,
      gameId: props.gameId,
      gold: 40,
      silver: 0,
      hand: handSchemes,
      deck,
      discard,
      history: [...currentGameData.history, startEvent],
      displayName: user.displayName
    }
    const playerId = `${user.id}_${props.gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.set(playerRef, playerData, { merge: true })
    const profileRef = profilesRef.doc(playerId)
    transaction.update(profileRef, {
      topDiscardScheme,
      deckEmpty: false,
      gold: 40
    })
  })
  console.info(`Started game with id ${props.gameId}!`)
})
export default startGame
