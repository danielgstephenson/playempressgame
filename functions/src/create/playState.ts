import { Transaction } from 'firelord'
import getOtherPlayers from '../get/otherPlayers'
import { Game, PlayState, Player, Result } from '../types'

export default async function createPlayState ({
  currentGame,
  currentPlayer,
  transaction
}: {
  currentGame: Result<Game>
  currentPlayer: Result<Player>
  transaction: Transaction
}): Promise<PlayState> {
  const otherPlayers = await getOtherPlayers({
    currentUid: currentPlayer.userId,
    gameId: currentGame.id,
    transaction
  })
  const players = [currentPlayer, ...otherPlayers]
  const playState = {
    game: currentGame,
    players
  }
  return playState
}
