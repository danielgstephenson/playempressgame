import createCloudFunction from '../create/cloudFunction'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import { GameProps } from '../types'
import createPlayState from '../create/playState'
import setPlayState from '../setPlayState'
import addTargetEvents from '../add/events/target'
import buy from '../buy'

const concede = createCloudFunction<GameProps>(async (props, context, transaction) => {
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
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  if (highestUntiedProfile == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'There is no highest untied bidder.'
    )
  }
  if (highestUntiedProfile.userId === currentPlayer.userId) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are the highest untied bidder.'
    )
  }
  const privateReadyEvent = createEvent('You are ready to concede the auction.')
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready to concede the auction.`)
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
    updateAuctionWaiting({
      currentGame,
      currentPlayer,
      privateEvent: privateReadyEvent,
      publicEvent: publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} is ready to concede!`)
    return
  }
  const buyerPlayerId = `${highestUntiedProfile.userId}_${gameId}`
  const playState = await createPlayState({
    currentGame,
    currentPlayer,
    transaction
  })
  const privateReadyMessage = 'You conceded the auction.'
  const publicReadyMessage = `${currentPlayer.displayName} conceded the auction.`
  addTargetEvents({
    playState,
    message: publicReadyMessage,
    targetMessages: {
      [currentPlayer.id]: privateReadyMessage
    }
  })
  buy({
    bid: highestUntiedProfile.bid,
    buyerId: buyerPlayerId,
    name: highestUntiedProfile.displayName,
    message: 'Everyone is ready',
    playState
  })
  setPlayState({
    playState,
    transaction
  })
  console.info(`${currentUid} conceded!`)
})
export default concede
