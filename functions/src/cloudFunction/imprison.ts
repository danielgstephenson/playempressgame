import createCloudFunction from '../create/cloudFunction'
import { GameProps } from '../types'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import getJoinedRanksGrammar from '../get/joined/ranks/grammar'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import updateImprison from '../update/imprison'
import getJoined from '../get/joined'

const imprison = createCloudFunction<GameProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const {
    currentGame,
    currentUid,
    currentPlayer
  } = await guardAuctionUnready({
    gameId,
    transaction,
    context
  })
  console.info(`Readying ${currentPlayer.id} for imprisonment...`)
  const tiers = currentGame
    .profiles
    .filter(profile => currentGame
      .profiles
      .some(otherProfile => otherProfile.bid === profile.bid)
    )
  if (tiers.length !== currentGame.profiles.length) {
    throw new https.HttpsError(
      'failed-precondition',
      'Everyone is not tied.'
    )
  }
  if (currentPlayer.lastBidder) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are the last bidder.'
    )
  }
  const leftmostTimeline = currentGame.timeline[0]
  const joinedCourt = getJoinedRanksGrammar(currentGame.court)
  const readyMessage = 'ready to imprison'
  const timelineMessage = leftmostTimeline == null
    ? ''
    : `${leftmostTimeline.rank} from the timeline`
  const courtMessage = currentGame.court.length === 0
    ? ''
    : `${joinedCourt.joinedRanks} from the court`
  const schemesMessage = getJoined([timelineMessage, courtMessage])
  const imprisonMessage = `${readyMessage} ${schemesMessage}.`
  const privateReadyEvent = createEvent(`You are ${imprisonMessage}`)
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ${imprisonMessage}`)
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
    updateAuctionWaiting({
      currentGame,
      currentPlayer,
      privateEvent: privateReadyEvent,
      publicEvent: publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} is ready to imprison!`)
    return
  }
  updateImprison({
    currentGame,
    currentPlayer,
    privateReadyEvent,
    publicReadyEvent,
    transaction
  })
  console.info(`${currentUid} withdrew!`)
})
export default imprison
