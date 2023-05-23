import { Transaction, deleteField } from 'firelord'
import { PlayState, Player } from './types'
import { gamesRef, playersRef } from './db'

export default function setPlayState ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  playState.players.forEach(player => {
    const { id, ...rest } = player
    const playerRef = playersRef.doc(id)
    const newPlayer: Player['writeFlatten'] = {
      ...rest,
      playScheme: rest.playScheme ?? deleteField(),
      trashScheme: rest.trashScheme ?? deleteField()
    }
    transaction.update(playerRef, newPlayer)
  })
  const { id, ...rest } = playState.game
  const gameRef = gamesRef.doc(id)
  transaction.update(gameRef, rest)
}
