import { DocumentReference } from 'firelord'
import { Choice, Game, PlayChanges, Player, Result } from '../types'
import guardEffectChanges from './effectChanges'

export default function guardChoiceChanges ({
  allPlayers,
  choice,
  currentPlayer,
  currentGame
}: {
  allPlayers: Array<Result<Player>>
  choice: Choice
  currentPlayer: Result<Player>
  currentGame: Result<Game>
  currentPlayerRef: DocumentReference<Player>
}): PlayChanges {
  if (choice.first == null) {
    return {
      playerChanges: {},
      profileChanges: {},
      effectPlayerEvents: [],
      effectChoices: [],
      effectSummons: [],
      effectDeck: currentPlayer.deck,
      effectDiscard: currentPlayer.discard,
      effectGold: currentPlayer.gold,
      effectSilver: currentPlayer.silver,
      effectHand: currentPlayer.hand
    }
  }
  const changes = guardEffectChanges({
    allPlayers,
    ref: choice.first,
    currentPlayer,
    currentGame,
    resume: true
  })
  return {
    ...changes,
    playerChanges: {
      ...changes.playerChanges,
      deck: changes.effectDeck
    },
    profileChanges: {
      ...changes.profileChanges,
      deckEmpty: changes.effectDeck.length === 0
    }
  }
}
