import { DocumentReference, Transaction, arrayUnion } from 'firelord'
import { createScheme } from '../create/scheme'
import { Game, Player, Scheme } from '../types'

export default function effectZero ({
  allPlayers,
  currentPlayer,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: {
  allPlayers: Array<Player['read']>
  currentPlayer: Player['read']
  gameData: Game['read']
  gameRef: DocumentReference<Game>
  hand: Scheme[]
  passedTimeline: Scheme[]
  playerRef: DocumentReference<Player>
  transaction: Transaction
}): void {
  const privelegeRanks = [1, 1, 1, 1, 1, 1, 1, 1]
  const privelegeSchemes = privelegeRanks.map(createScheme)

  transaction.update(playerRef, {
    hand: arrayUnion(...privelegeSchemes)
  })
}
