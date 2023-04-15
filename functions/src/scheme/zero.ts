import { createScheme } from '../create/scheme'
import { Game, Player } from '../types'

export default function schemeZero ({
  gameData,
  currentPlayer
}: {
  gameData: Game['read']
  allPlayers: Array<Player['read']>
  currentPlayer: Player['read']
}): {
    gameData: Game['read']
    currentPlayer: Player['read']
  } {
  const playedHand = currentPlayer.hand.filter((scheme: any) => scheme.id !== currentPlayer.trashId)
  const privelegeRanks = [1, 1, 1, 1, 1, 1, 1, 1]
  const privelegeSchemes = privelegeRanks.map(createScheme)
  const privelegeHand = [...playedHand, ...privelegeSchemes]

  const newCurrentPlayer = { ...currentPlayer, hand: privelegeHand }

  return {
    gameData,
    currentPlayer: newCurrentPlayer
  }
}
