import createCloudFunction from '../create/cloudFunction'
import { SchemesProps } from '../types'
import { https } from 'firebase-functions/v1'
import getJoined from '../get/joined'
import guardCurrentBidding from '../guard/current/bidding'
import getGrammar from '../get/grammar'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import discardTableau from '../discardTableau'
import addEvent from '../add/event'
import getOtherPlayers from '../get/otherPlayers'
import setPlayState from '../setPlayState'

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
    const joined = getJoined(displayNames)
    const { toBe } = getGrammar(unready.length)
    throw new https.HttpsError(
      'failed-precondition',
      `${joined} ${toBe} are not ready.`
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
    const joined = getJoined(missing)
    const grammar = getGrammar(missing.length)
    throw new https.HttpsError(
      'failed-precondition',
      `${joined} ${grammar.toBe} not in the court.`
    )
  }
  const otherPlayers = await getOtherPlayers({
    currentUid,
    transaction,
    gameId: props.gameId
  })
  const joined = getJoined(props.schemeIds)
  const privateMessage = props.schemeIds.length === 0
    ? 'You took no schemes from the court.'
    : `You took ${joined} from the court.`
  addEvent(currentPlayer, privateMessage)
  const publicMessage = props.schemeIds.length === 0
    ? `${currentPlayer.displayName} took no schemes from the court.`
    : `${currentPlayer.displayName} took ${joined} from the court.`
  addEvent(currentGame, publicMessage)
  otherPlayers.forEach(player => {
    addEvent(player, publicMessage)
  })
  const players = [currentPlayer, ...otherPlayers]
  const playState = {
    game: currentGame,
    players
  }
  discardTableau({ playState })
  setPlayState({
    playState,
    transaction
  })
  console.info(`${currentUid} withdrew!`)
})
export default court
