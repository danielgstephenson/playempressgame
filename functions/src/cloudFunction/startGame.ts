import { https } from 'firebase-functions/v1'
import guardDocData from '../guard/docData'
import guardJoinPhase from '../guard/joinPhase'
import { createCloudFunction } from '../create/cloudFunction'
import { createRange } from '../create/range'
import { green, playersRef, profilesRef, red, usersRef, yellow } from '../db'
import { createScheme } from '../create/scheme'
import { createEvent } from '../create/event'
import guardJoinedGame from '../guard/joinedGame'
import { arrayUnion, documentId, query, where } from 'firelord'
import guardDefined from '../guard/defined'
import { StartGameProps } from '../types'

const startGame = createCloudFunction<StartGameProps>(async (props, context, transaction) => {
  const { gameData, gameRef, userRef } = await guardJoinedGame({
    context,
    gameId: props.gameId,
    transaction
  })
  const userData = await guardDocData({
    docRef: userRef,
    transaction
  })
  if (gameData.userIds.length < 2) {
    throw new https.HttpsError(
      'failed-precondition',
      'This game does not have enough players.'
    )
  }
  guardJoinPhase({ gameData })
  const idField = documentId()
  const whereId = where(idField, 'in', gameData.userIds)
  const q = query(usersRef.collection(), whereId)
  const snapshot = await transaction.get(q)
  const users = snapshot.docs.map(docSnapshot => {
    const data = docSnapshot.data()
    return {
      id: docSnapshot.id,
      ...data
    }
  })
  console.log('starting game...')
  const range = createRange(26) // [0..25]
  console.log('range test:', range)
  const separated = [1, 7]
  const rangeSeparated = range.filter(rank => !separated.includes(rank))
  const randomRange = range.map(() => Math.random())
  const shuffled = [...rangeSeparated].sort((aRank, bRank) => {
    const randomA = randomRange[aRank] as number
    const randomB = randomRange[bRank] as number
    return randomA - randomB
  })
  console.log('shuffled test:', shuffled)
  const empressSize = 13 + gameData.userIds.length
  console.log('empressSize test:', empressSize)
  const empressSlice = shuffled.slice(0, empressSize)
  console.log('empressSlice test:', empressSlice)
  const sorted = [...empressSlice].sort((aRank, bRank) => {
    return aRank - bRank
  })
  console.log('sorted test:', sorted)
  const court = guardDefined(sorted[0], 'Court')
  const dungeon = guardDefined(sorted[1], 'Dungeon')
  const palaceSlice = sorted.slice(2)
  const empressGreen = palaceSlice.filter(rank => green.includes(rank))
  const empressRed = palaceSlice.filter(rank => red.includes(rank))
  const empressYellow = palaceSlice.filter(rank => yellow.includes(rank))
  const lowestYellow = guardDefined(empressYellow[0], 'Empress Yellow')
  const lowGreen = empressGreen.slice(0, 2)
  const lowRed = empressRed.slice(0, 2)
  const basePortfolio = [7, lowestYellow, ...lowGreen, ...lowRed]
  const empressLeft = palaceSlice.filter(rank => !basePortfolio.includes(rank))
  const lowestLeft = guardDefined(empressLeft[0], 'Lowest Left')
  const portfolio = [...basePortfolio, lowestLeft]
  const timeline = empressLeft.slice(1)
  const timelineSchemes = timeline.map(rank => createScheme(rank))
  const courtScheme = createScheme(court)
  const dungeonScheme = createScheme(dungeon)
  const startEvent = createEvent(`${userData.displayName} started game ${props.gameId}`)
  transaction.update(gameRef, {
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
  const topDeck = guardDefined(sortedPortfolio[deckIndex], 'Top Deck')
  if (topDeck == null) {
    throw new https.HttpsError(
      'aborted',
      'topDeck is null.'
    )
  }
  const discardIndex = sortedPortfolio.length - 1
  const topDiscard = guardDefined(sortedPortfolio[discardIndex], 'Top Discard')
  const hand = sortedPortfolio.slice(0, sortedPortfolio.length - 2)
  users.forEach((user) => {
    const topDeckScheme = createScheme(topDeck)
    const topDiscardScheme = createScheme(topDiscard)
    const deck = [topDeckScheme]
    const discard = [topDiscardScheme]
    const handSchemes = hand.map(rank => createScheme(rank))
    const playerData = {
      userId: user.id,
      gameId: props.gameId,
      hand: handSchemes,
      deck,
      discard,
      history: [...gameData.history, startEvent],
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
  console.log('started!')
})
export default startGame
