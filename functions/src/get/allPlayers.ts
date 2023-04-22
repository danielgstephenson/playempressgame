import { Transaction } from 'firelord'
import { Player, Result } from '../types'
import getOtherPlayers from './otherPlayers'

export default async function getAllPlayers ({ currentPlayer, gameId, transaction }: {
  currentPlayer: Result<Player>
  gameId: string
  transaction: Transaction
}): Promise<Array<Result<Player>>> {
  const otherPlayers = await getOtherPlayers({
    currentUid: currentPlayer.userId,
    gameId,
    transaction
  })
  const allPlayers = [...otherPlayers, currentPlayer]
  return allPlayers
}
