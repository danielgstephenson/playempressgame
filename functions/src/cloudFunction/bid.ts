import createCloudFunction from '../create/cloudFunction'
import { BidProps } from '../types'
import guardString from '../guard/string'
import guardNumber from '../guard/number'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import updateOtherPlayers from '../update/otherPlayers'

const bid = createCloudFunction<BidProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const bid = guardNumber(props.bid, 'Play ready bid')
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayer,
    currentPlayerRef
  } = await guardCurrentBidding({
    gameId,
    transaction,
    context
  })
  console.info(`Bidding ${bid} for ${currentUid}...`)
  if (currentPlayer.gold < bid) {
    throw new https.HttpsError(
      'out-of-range',
      'You do not have enough gold.'
    )
  }
  if (currentPlayer.bid >= bid) {
    throw new https.HttpsError(
      'out-of-range',
      'You may only raise.'
    )
  }
  if (currentPlayer.withdrawn) {
    throw new https.HttpsError(
      'failed-precondition',
      'You withdrew.'
    )
  }
  if (bid % 5 !== 0) {
    throw new https.HttpsError(
      'invalid-argument',
      'You may only bid gold.'
    )
  }
  const currentPlayerEvent = createEvent(`You bid ${bid}.`)
  transaction.update(currentPlayerRef, {
    bid,
    events: arrayUnion(currentPlayerEvent),
    lastBidder: true,
    auctionReady: false
  })
  const profiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return { ...profile, auctionReady: false, bid, lastBidder: true }
    }
    return { ...profile, auctionReady: false, lastBidder: false }
  })
  const publicMessage = `${currentPlayer.displayName} bid ${bid}.`
  const observerEvent = createEvent(publicMessage)
  transaction.update(currentGameRef, {
    profiles,
    events: arrayUnion(observerEvent)
  })
  const userIds = currentGame.profiles.map(profile => profile.userId)
  updateOtherPlayers({
    currentUid,
    gameId,
    transaction,
    userIds,
    update: {
      events: arrayUnion(observerEvent),
      lastBidder: false,
      auctionReady: false
    }
  })
  console.info(`${currentPlayer.id} bid ${bid}!`)
})
export default bid
