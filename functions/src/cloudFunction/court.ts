import createCloudFunction from '../create/cloudFunction'
import { SchemesProps } from '../types'
import { https } from 'firebase-functions/v1'
import join from '../join'
import guardCurrentBidding from '../guard/current/bidding'
import getGrammar from '../get/grammar'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import carryOutFourteen from '../carryOut/fourteen'
import addEvent from '../add/event'
import setPlayState from '../setPlayState'
import joinRanks from '../join/ranks'
import getLowestRankScheme from '../get/lowestRankScheme'
import createPlayState from '../create/playState'
import addTargetEvents from '../add/events/target'

const court = createCloudFunction<SchemesProps>(async (props, context, transaction) => {
  const {
    currentGame,
    currentUid,
    currentPlayer
  } = await guardCurrentBidding({
    gameId: props.gameId,
    transaction,
    context
  })
  console.info(`Taking court schemes for ${currentPlayer.displayName}...`)
  const unready = currentGame.profiles.filter(profile => !profile.auctionReady)
  if (unready.length > 0) {
    const displayNames = unready.map(profile => profile.displayName)
    const joined = join(displayNames)
    const { toBe } = getGrammar(unready.length)
    throw new https.HttpsError(
      'failed-precondition',
      `${joined} ${toBe} not ready.`
    )
  }
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  if (highestUntiedProfile?.userId !== currentUid) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not the highest untied bidder.'
    )
  }
  const twelve = currentPlayer.tableau.some(scheme => scheme.rank === 12)
  if (twelve) {
    const missing = props
      .schemeIds
      .filter(id => currentGame
        .court
        .every(scheme => scheme.id !== id) &&
      currentGame
        .dungeon
        .every(scheme => scheme.id !== id))
    if (missing.length > 0) {
      const joined = join(missing)
      const grammar = getGrammar(missing.length)
      throw new https.HttpsError(
        'failed-precondition',
        `${joined} ${grammar.toBe} not in the court or dungeon.`
      )
    }
  } else {
    const missing = props
      .schemeIds
      .filter(id => currentGame.court.find(scheme => scheme.id === id) == null)
    if (missing.length > 0) {
      const joined = join(missing)
      const grammar = getGrammar(missing.length)
      throw new https.HttpsError(
        'failed-precondition',
        `${joined} ${grammar.toBe} not in the court.`
      )
    }
  }
  const playState = await createPlayState({
    currentGame,
    currentPlayer,
    transaction
  })
  const courtTaken = playState.game.court.filter(scheme => props.schemeIds.includes(scheme.id))
  currentPlayer.tableau.push(...courtTaken)
  playState.game.court = playState.game.court.filter(scheme => !props.schemeIds.includes(scheme.id))
  const courtJoined = joinRanks(courtTaken)
  const courtMessage = courtTaken.length === 0
    ? 'no schemes from the court'
    : `${courtJoined} from the court`
  const privateCourtMessage = `You took ${courtMessage}.`
  const publicCourtMessage = `${currentPlayer.displayName} took ${courtMessage}.`
  if (twelve && playState.game.dungeon.length > 0) {
    const dungeonTaken = playState.game.dungeon.filter(scheme => props.schemeIds.includes(scheme.id))
    currentPlayer.tableau.push(...dungeonTaken)
    playState.game.dungeon = playState.game.dungeon.filter(scheme => !props.schemeIds.includes(scheme.id))
    const dungeonJoined = joinRanks(dungeonTaken)
    const dungeonMessage = props.schemeIds.length === 0
      ? 'no schemes from the dungeon'
      : `${dungeonJoined} from the dungeon`
    const privateDungeonMessage = `${privateCourtMessage} and ${dungeonMessage}.`
    const publicDungeonMessage = `${publicCourtMessage} and ${dungeonMessage}.`
    addTargetEvents({
      playState,
      message: publicDungeonMessage,
      targetMessages: {
        [currentPlayer.id]: privateDungeonMessage
      }
    })
  } else {
    const privateMessage = `You took ${courtMessage}.`
    const publicMessage = `${currentPlayer.displayName} took ${courtMessage}.`
    addTargetEvents({
      playState,
      message: publicMessage,
      targetMessages: {
        [currentPlayer.id]: privateMessage
      }
    })
  }
  const lowest = getLowestRankScheme(playState.game.court)
  if (lowest != null) {
    const beforeDungeon = [...playState.game.dungeon]
    const beforeDungeonJoined = joinRanks(beforeDungeon)
    const beforeDungeonMessage = `The dungeon was ${beforeDungeonJoined}.`
    playState.game.court = playState.game.court.filter(scheme => scheme.id !== lowest.id)
    playState.game.dungeon.push(lowest)
    const afterDungeon = [...playState.game.dungeon]
    const afterDungeonJoined = joinRanks(afterDungeon)
    const afterDungeonMessage = `The dungeon becomes ${afterDungeonJoined}.`
    const message = `The lowest remaining court scheme, ${lowest.rank}, was imprisoned in the dungeon.`
    const observerEvent = addEvent(currentGame, message)
    addEvent(observerEvent, beforeDungeonMessage)
    addEvent(observerEvent, afterDungeonMessage)
    playState.players.forEach(player => {
      const playerEvent = addEvent(player, message)
      addEvent(playerEvent, beforeDungeonMessage)
      addEvent(playerEvent, afterDungeonMessage)
    })
  }
  carryOutFourteen({ playState })
  setPlayState({
    playState,
    transaction
  })
  console.info(`${currentUid} withdrew!`)
})
export default court
