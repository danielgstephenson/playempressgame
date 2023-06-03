import { Transaction } from 'firelord'
import { playersRef } from '../db'
import { Game, Player, Result, Write } from '../types'

export default function updateOtherPlayers ({
  currentUid,
  game,
  gameId,
  transaction,
  userIds,
  update
}: {
  currentUid: string
  gameId: string
  transaction: Transaction
  update: Write<Player>
} & ({
  userIds: string[]
  game?: undefined
} | {
  game: Result<Game>
  userIds?: undefined
})): void {
  const ids = userIds ?? game.profiles.map(({ userId }) => userId)
  ids.forEach((userId) => {
    if (userId === currentUid) return
    const playerId = `${userId}_${gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, update)
  })
}
