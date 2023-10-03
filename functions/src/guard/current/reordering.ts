import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { CurrentPlayerGuard } from '../../types'
import guardCurrentBidding from './bidding'

export default async function guardCurrentReordering ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<CurrentPlayerGuard> {
  const guard = await guardCurrentBidding({
    context,
    gameId,
    transaction
  })
  const fourteen = guard.currentPlayer.inPlay.some(scheme => scheme.rank === 14)
  if (!fourteen) {
    throw new https.HttpsError(
      'failed-precondition',
      'You do not have a 14 in play.'
    )
  }
  return guard
}
