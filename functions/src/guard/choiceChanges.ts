import getPlayChanges from '../get/playChanges'
import { Choice, Game, EffectResultChanges, Player, Result } from '../types'
import guardEffectChanges from './effectChanges'

export default function guardChoiceChanges ({
  allPlayers,
  choice,
  currentPlayer,
  currentGame,
  oldPlayer
}: {
  allPlayers: Array<Result<Player>>
  choice: Choice
  currentPlayer: Result<Player>
  currentGame: Result<Game>
  oldPlayer: Result<Player>
}): EffectResultChanges {
  console.log('guardChoiceChanges', {
    allPlayers,
    choice,
    currentPlayer,
    currentGame,
    oldPlayer
  })
  if (choice.first == null) {
    const playChanges = getPlayChanges({
      oldDeck: oldPlayer.deck,
      oldDiscard: oldPlayer.discard,
      oldGold: oldPlayer.gold,
      oldSilver: oldPlayer.silver,
      newDeck: currentPlayer.deck,
      newDiscard: currentPlayer.discard,
      newGold: currentPlayer.gold,
      newHand: currentPlayer.hand,
      newSilver: currentPlayer.silver
    })
    return {
      ...playChanges,
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
    oldPlayer,
    resume: true
  })
  return changes
}
