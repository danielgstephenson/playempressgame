import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import guardHandScheme from '../handScheme'
import guardCurrentPlaying from './player'
import { CurrentHandGuard } from '../../types'
import serializeScheme from '../../serialize/scheme'

export default async function guardCurrentHand ({ context, transaction, gameId, schemeId, label }: {
  context: https.CallableContext
  gameId: string
  schemeId: string
  transaction: Transaction
  label: string
}): Promise<CurrentHandGuard> {
  const currentPlayerGuard = await guardCurrentPlaying({
    gameId,
    transaction,
    context
  })
  const scheme = guardHandScheme({ hand: currentPlayerGuard.currentPlayer.hand, schemeId, label })
  const schemeRef = serializeScheme(scheme)

  return { ...currentPlayerGuard, scheme, schemeRef }
}
