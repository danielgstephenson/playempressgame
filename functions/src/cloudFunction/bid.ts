import createCloudFunction from '../create/cloudFunction'
import { BidProps } from '../types'
import guardString from '../guard/string'
import guardNumber from '../guard/number'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'

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
  if (currentPlayer.bid > bid) {
    throw new https.HttpsError(
      'out-of-range',
      'You cannot lower your bid.'
    )
  }
  transaction.update(currentPlayerRef, {
    bid
  })
  const profiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return { ...profile, bid }
    }
    return profile
  })
  transaction.update(currentGameRef, {
    profiles
  })
  console.info(`Bid ${bid} for ${currentUid}!`)
})
export default bid
