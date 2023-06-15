import createCloudFunction from '../create/cloudFunction'
import { SchemesProps } from '../types'
import { https } from 'firebase-functions/v1'
import join from '../join'
import guardCurrentBidding from '../guard/current/bidding'
import getGrammar from '../get/grammar'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import carryOutFourteen from '../carryOut/fourteen'
import addEvent from '../add/event'
import getOtherPlayers from '../get/otherPlayers'
import setPlayState from '../setPlayState'
import joinRanks from '../join/ranks'
import getLowestRankScheme from '../get/lowestRankScheme'

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
  const missing = props.schemeIds.filter(id => currentGame.court.find(scheme => scheme.id === id) == null)
  if (missing.length > 0) {
    const joined = join(missing)
    const grammar = getGrammar(missing.length)
    throw new https.HttpsError(
      'failed-precondition',
      `${joined} ${grammar.toBe} not in the court.`
    )
  }
  const taken = currentGame.court.filter(scheme => props.schemeIds.includes(scheme.id))
  currentPlayer.tableau.push(...taken)
  currentGame.court = currentGame.court.filter(scheme => !props.schemeIds.includes(scheme.id))
  const lowest = getLowestRankScheme(currentGame.court)
  const joined = joinRanks(taken)
  const privateMessage = props.schemeIds.length === 0
    ? 'You took no schemes from the court.'
    : `You took ${joined} from the court.`
  addEvent(currentPlayer, privateMessage)
  const publicMessage = props.schemeIds.length === 0
    ? `${currentPlayer.displayName} took no schemes from the court.`
    : `${currentPlayer.displayName} took ${joined} from the court.`

  addEvent(currentGame, publicMessage)
  const otherPlayers = await getOtherPlayers({
    currentUid,
    transaction,
    gameId: props.gameId
  })
  otherPlayers.forEach(player => {
    addEvent(player, publicMessage)
  })
  const players = [currentPlayer, ...otherPlayers]
  if (lowest != null) {
    const beforeDungeon = [...currentGame.dungeon]
    const beforeDungeonJoined = joinRanks(beforeDungeon)
    const beforeDungeonMessage = `The dungeon was ${beforeDungeonJoined}.`
    currentGame.court = currentGame.court.filter(scheme => scheme.id !== lowest.id)
    currentGame.dungeon.push(lowest)
    const afterDungeon = [...currentGame.dungeon]
    const afterDungeonJoined = joinRanks(afterDungeon)
    const afterDungeonMessage = `The dungeon becomes ${afterDungeonJoined}.`
    const message = `The lowest remaining court scheme, ${lowest.rank}, was imprisoned in the dungeon.`
    const observerEvent = addEvent(currentGame, message)
    addEvent(observerEvent, beforeDungeonMessage)
    addEvent(observerEvent, afterDungeonMessage)
    players.forEach(player => {
      const playerEvent = addEvent(player, message)
      addEvent(playerEvent, beforeDungeonMessage)
      addEvent(playerEvent, afterDungeonMessage)
    })
  }
  const playState = {
    game: currentGame,
    players
  }
  carryOutFourteen({ playState })
  setPlayState({
    playState,
    transaction
  })
  console.info(`${currentUid} withdrew!`)
})
export default court
