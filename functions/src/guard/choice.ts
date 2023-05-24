import { https } from 'firebase-functions/v1'
import guardCurrentHand from './current/hand'
import { ChoiceGuard } from '../types'
import { Transaction } from 'firelord'

export default async function guardChoice ({ context, gameId, label, schemeId, transaction }: {
  context: https.CallableContext
  gameId: string
  label: string
  schemeId: string
  transaction: Transaction
}): Promise<ChoiceGuard> {
  const handGuard = await guardCurrentHand({
    gameId,
    transaction,
    context,
    schemeId,
    label
  })
  const choice = handGuard
    .currentGame
    .choices
    .find(choice => choice.playerId === handGuard.currentPlayerId)
  if (choice == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not choosing a scheme to put on your deck.'
    )
  }

  return {
    ...handGuard,
    choice
  }
}
