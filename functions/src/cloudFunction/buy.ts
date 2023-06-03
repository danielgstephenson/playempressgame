import createCloudFunction from '../create/cloudFunction'
import { GameProps } from '../types'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { increment } from 'firelord'
import getGrammar from '../get/grammar'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import updateEndAuction from '../update/endAuction'
import getHighestUntiedProfile from '../get/highestUntiedProfile'

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
  console.info(`Readying ${currentPlayer.id} for buying...`)
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  if (highestUntiedProfile?.userId !== currentPlayer.userId) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not the highest untied bidder.'
    )
  }
  const privateReadyEvent = createEvent('You are ready to buy.')
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready to buy.`)
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
    updateAuctionWaiting({
      currentGame,
      currentPlayer,
      privateEvent: privateReadyEvent,
      publicEvent: publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} is ready to buy!`)
    return
  }
  const leftmost = currentGame.timeline[0]
  const endMessage = 'Everyone is ready to buy, so'
  const { spelled } = getGrammar(currentPlayer.bid)
  const privateEndSuffix = leftmost == null
    ? 'the auction ends'
    : `you pay ${spelled} gold and take ${leftmost.rank} into your tableau`
  const privateEndEvent = createEvent(`${endMessage} ${privateEndSuffix}.`)
  const publicEndSuffix = leftmost == null
    ? 'the auction ends'
    : `${currentPlayer.displayName} pays ${spelled} gold and takes ${leftmost.rank} into their tableau`
  const publicEndEvent = createEvent(`${endMessage} ${publicEndSuffix}.`)
  updateEndAuction({
    currentGame,
    currentPlayer,
    currentPlayerChanges: {
      gold: increment(-currentPlayer.bid)
    },
    currentProfileChanges: {
      gold: currentPlayer.gold - currentPlayer.bid
    },
    privateReadyEvent,
    privateEndEvent,
    publicReadyEvent,
    publicEndEvent,
    transaction
  })
  console.info(`${currentUid} bought!`)
})
export default imprison
