import { https } from "firebase-functions/v1"
import checkCurrentUid from "../check/currentUid"
import checkDocData from "../check/docData"
import checkJoinPhase from "../check/joinPhase"
import { createCloudFunction } from "../createCloudFunction"
import { createRange } from "../createRange"
import { gamesRef, green, playersRef, profilesRef, red, usersRef, yellow } from "../db"

const startGame = createCloudFunction(async (props, context, transaction) => {
  const currentUid = checkCurrentUid({ context })
  await checkDocData({
    collectionRef: usersRef,
    docId: currentUid,
    transaction
  })
  const { 
    docRef : gameRef, 
    docData: gameData 
  } = await checkDocData({
    collectionRef: gamesRef,
    docId: props.gameId,
    transaction
  })
  if (!gameData.userIds.includes(currentUid)) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has not joined the game.'
    )
  }
  if (gameData.userIds.length < 2) {
    throw new https.HttpsError(
      'failed-precondition',
      'This game does not have enough players.'
    )
  }
  checkJoinPhase({gameData})
  console.log(`starting game...`)
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
  const court = sorted[0]
  const dungeon = sorted[1]
  const palaceSlice = sorted.slice(2)
  console.log('palaceSlice test:', palaceSlice)
  const empressGreen = palaceSlice.filter(rank => green.includes(rank))
  const empressRed = palaceSlice.filter(rank => red.includes(rank))
  const empressYellow = palaceSlice.filter(rank => yellow.includes(rank))
  const lowestYellow = empressYellow[0]
  console.log('lowestYellow test:', lowestYellow)
  const lowGreen = empressGreen.slice(0, 2)
  console.log('lowGreen test:', lowGreen)
  const lowRed = empressRed.slice(0, 2)
  console.log('lowRed test:', lowRed)
  const basePortfolio = [7, lowestYellow, ...lowGreen, ...lowRed]
  console.log('basePortfolio test:', basePortfolio)
  const empressLeft = palaceSlice.filter(rank => !basePortfolio.includes(rank))
  console.log('empressLeft test:', empressLeft)
  const lowestLeft = empressLeft[0]
  const portfolio = [...basePortfolio, lowestLeft]
  console.log('portfolio test:', portfolio)
  const timeline = empressLeft.slice(1)
  console.log('timeline test:', timeline)
  transaction.update(gameRef,{
    phase: 'play',
    court: [court],
    dungeon: [dungeon],
    timeline
  })
  const sortedPortfolio = [...portfolio].sort((aRank, bRank) => {
    return aRank - bRank
  })
  const topDeck = sortedPortfolio[sortedPortfolio.length - 2]
  const topDiscard = sortedPortfolio[sortedPortfolio.length - 1]
  const hand = sortedPortfolio.slice(0, sortedPortfolio.length - 2)
  gameData.userIds.forEach((userId: string) => {
    const deck = [topDeck]
    const discard = [topDiscard]
    const playerData = { userId, gameId: props.gameId, hand, deck, discard }
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.set(playerRef, playerData)
    const profileRef = profilesRef.doc(playerId)
    transaction.update(profileRef,{
      topDiscard,
      deckEmpty: false,
      gold: 40
    })
  })
  console.log('started!')
})
export default startGame