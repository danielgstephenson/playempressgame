import { Transaction, query, where } from 'firelord'
import getQuery from './query'
import { playersRef } from '../db'
import { Player, Result } from '../types'

export default async function getOtherPlayers ({ currentUid, gameId, transaction }: {
  currentUid: string
  gameId: string
  transaction: Transaction
}): Promise<Array<Result<Player>>> {
  const whereGameId = where('gameId', '==', gameId)
  const whereUserId = where('userId', '!=', currentUid)
  const otherPlayersQuery = query(playersRef.collection(), whereGameId, whereUserId)
  const otherPlayers = await getQuery({ query: otherPlayersQuery, transaction })
  return otherPlayers
}
