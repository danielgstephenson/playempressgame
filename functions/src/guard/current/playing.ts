import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { CurrentPlayerGuard } from '../../types'
import guardCurrentPlayer from './player'

export default async function guardCurrentPlaying ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<CurrentPlayerGuard> {
  const currentPlayerGuard = await guardCurrentPlayer({
    context,
    gameId,
    transaction
  })
  if (currentPlayerGuard.currentGame.phase !== 'play') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game is not in the play phase.'
    )
  }
  return currentPlayerGuard
}
