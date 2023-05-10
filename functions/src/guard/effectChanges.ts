import getEffectResultChanges from '../get/effectResultChanges'
import { Result, Player, Game, Scheme, EffectResultChanges } from '../types'
import guardEffectResult from './effectResult'

export default function guardEffectChanges ({
  allPlayers,
  currentPlayer,
  currentGame,
  first,
  oldPlayer,
  ref,
  resume
}: {
  allPlayers: Array<Result<Player>>
  currentPlayer: Result<Player>
  currentGame: Result<Game>
  first?: boolean
  oldPlayer?: Result<Player>
  ref: Scheme
  resume?: boolean
}): EffectResultChanges {
  const {
    effectResult,
    oldDeck,
    oldDiscard,
    oldHand
  } = guardEffectResult({
    allPlayers,
    first,
    currentPlayer,
    currentGame,
    ref,
    resume
  })
  const originalDeck = oldPlayer != null ? oldPlayer.deck : oldDeck
  const originalDiscard = oldPlayer != null ? oldPlayer.discard : oldDiscard
  const originalHand = oldPlayer != null ? oldPlayer.hand : oldHand
  const changes = getEffectResultChanges({
    deck: originalDeck,
    discard: originalDiscard,
    effectResult,
    gold: currentPlayer.gold,
    hand: originalHand,
    silver: currentPlayer.silver
  })
  return changes
}
