import { DocumentReference } from 'firelord'
import { Choice, EffectResultGuard, Game, Player, Result } from '../types'
import guardEffectResult from './effectResult'
import guardSchemes from './schemes'

export default function guardChoiceResult ({
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
}): EffectResultGuard {
  if (choice.first == null) {
    const effectDeck = guardSchemes({ refs: currentPlayer.deck })
    const effectDiscard = guardSchemes({ refs: currentPlayer.discard })
    const effectHand = guardSchemes({ refs: currentPlayer.hand })
    const effectResult = {
      effectDeck,
      effectDiscard,
      effectHand,
      effectGold: currentPlayer.gold,
      effectSilver: currentPlayer.silver,
      effectChoices: [],
      effectPlayerEvents: [],
      effectSummons: []
    }
    const effectResultGuard = {
      effectResult,
      oldDeck: effectDeck,
      oldDiscard: effectDiscard,
      oldDungeon: guardSchemes({ refs: currentGame.dungeon }),
      oldHand: effectHand,
      oldPlayers: allPlayers,
      passedTimeline: guardSchemes({ refs: currentGame.timeline })
    }
    return effectResultGuard
  }
  const effectResultGuard = guardEffectResult({
    allPlayers,
    ref: choice.first,
    currentPlayer,
    currentGame,
    resume: true
  })
  return effectResultGuard
}
