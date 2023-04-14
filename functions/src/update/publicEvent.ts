import { Transaction } from 'firelord'
import { Game } from '../types'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from './players'
import { gamesRef } from '../db'

export default function updatePublicEvent ({ currentUid, message, gameId, gameData, transaction }: {
  currentUid: string
  gameData: Game['read']
  gameId: string
  message: string
  transaction: Transaction
}): void {
  const update = createEventUpdate(message)
  const gameRef = gamesRef.doc(gameId)
  transaction.update(gameRef, update)
  updateOtherPlayers({
    currentUid,
    gameId,
    transaction,
    users: gameData.users,
    update
  })
}
