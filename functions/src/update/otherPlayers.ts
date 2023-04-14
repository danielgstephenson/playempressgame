import { Transaction } from 'firelord'
import { playersRef } from '../db'
import { GameUser, HistoryUpdate } from '../types'

export default function updateOtherPlayers ({ currentUid, gameId, transaction, users, update }: {
  currentUid: string
  gameId: string
  transaction: Transaction
  users: GameUser[]
  update: HistoryUpdate
}): void {
  users.forEach((user) => {
    if (user.id === currentUid) return
    const playerId = `${user.id}_${gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, update)
  })
}
