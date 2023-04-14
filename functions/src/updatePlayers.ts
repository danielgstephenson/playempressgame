import { Transaction } from 'firelord'
import { playersRef } from './db'
import { HistoryUpdate } from './types'

export default function updateOtherPlayers ({ currentUid, gameId, transaction, userIds, update }: {
  currentUid: string
  gameId: string
  transaction: Transaction
  userIds: string[]
  update: HistoryUpdate
}): void {
  userIds.forEach((userId) => {
    if (userId === currentUid) return
    const playerId = `${userId}_${gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, update)
  })
}
