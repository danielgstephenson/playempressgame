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
import { StartGameProps } from '../types'
import getQuery from '../getQuery'
import guardSchemeData from '../guard/schemeData'
import isGreen from '../is/green'
import isRed from '../is/red'
import isYellow from '../is/yellow'

const startGame = createCloudFunction<StartGameProps>(async (props, context, transaction) => {
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
  const range = createRange(26) // [0..25]
  const separated = [1, 7]
  const rangeSeparated = range.filter(rank => !separated.includes(rank))
  const randomRange = range.map(() => Math.random())
  const shuffled = [...rangeSeparated].sort((aRank, bRank) => {
    const randomA = randomRange[aRank] as number
    const randomB = randomRange[bRank] as number
    return randomA - randomB
  })
  const empressSize = 13 + currentGameData.users.length
  const empressSlice = shuffled.slice(0, empressSize)
  const sorted = [...empressSlice].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const court = guardDefined(sorted[0], 'Court')
  const dungeon = guardDefined(sorted[1], 'Dungeon')
  const palaceSlice = sorted.slice(2)
  const empressGreen = palaceSlice.filter(rank => isGreen(guardSchemeData(rank)))
  const empressRed = palaceSlice.filter(rank => isRed(guardSchemeData(rank)))
  const empressYellow = palaceSlice.filter(rank => isYellow(guardSchemeData(rank)))
  const lowestYellow = guardDefined(empressYellow[0], 'Empress yellow')
  const lowGreen = empressGreen.slice(0, 2)
  const lowRed = empressRed.slice(0, 2)
  const basePortfolio = [7, lowestYellow, ...lowGreen, ...lowRed]
  const empressLeft = palaceSlice.filter(rank => !basePortfolio.includes(rank))
  const lowestLeft = guardDefined(empressLeft[0], 'Lowest left')
  const portfolio = [...basePortfolio, lowestLeft]
  const timeline = empressLeft.slice(1)
  const timelineSchemes = timeline.map(rank => createSchemeRef(rank))
  const courtScheme = createSchemeRef(court)
  const dungeonScheme = createSchemeRef(dungeon)
  const currentUser = guardDefined(users.find(user => user.id === context.auth?.uid), 'Current user')
  const startEvent = createEvent(`${currentUser.displayName} started game ${props.gameId}.`)
  transaction.update(currentGameRef, {
    phase: 'play',
    court: [courtScheme],
    dungeon: [dungeonScheme],
    timeline: timelineSchemes,
    history: arrayUnion(startEvent)
  })
  const sortedPortfolio = [...portfolio].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const deckIndex = sortedPortfolio.length - 2
  const topDeck = guardDefined(sortedPortfolio[deckIndex], 'Top deck')
  const discardIndex = sortedPortfolio.length - 1
  const topDiscard = guardDefined(sortedPortfolio[discardIndex], 'Top discard')
  const hand = sortedPortfolio.slice(0, sortedPortfolio.length - 2)
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
