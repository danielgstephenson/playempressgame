import { https } from 'firebase-functions'
import guardCurrentBidding from './current/bidding'
import { CurrentPlayerGuard } from '../types'
import { Transaction } from 'firelord'

export default async function guardAuctionUnready ({
  gameId,
  transaction,
  context
}: {
  gameId: string
  transaction: Transaction
  context: https.CallableContext
}): Promise<CurrentPlayerGuard> {
  const guard = await guardCurrentBidding({
    gameId,
    transaction,
    context
  })
  if (guard.currentPlayer.auctionReady) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are already ready.'
    )
  }
  if (guard.currentPlayer.withdrawn) {
    throw new https.HttpsError(
      'failed-precondition',
      'You withdrew.'
    )
  }
  return guard
}
