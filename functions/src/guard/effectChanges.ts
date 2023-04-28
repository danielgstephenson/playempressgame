import getPlayChanges from '../get/playChanges'
import { Result, Player, Game, SchemeRef, PlayChanges } from '../types'
import guardEffectResult from './effectResult'

export default function guardEffectChanges ({
  allPlayers,
  currentPlayer,
  currentGame,
  first,
  ref,
  resume
}: {
  allPlayers: Array<Result<Player>>
  currentPlayer: Result<Player>
  currentGame: Result<Game>
  first?: boolean
  ref: SchemeRef
  resume?: boolean
}): PlayChanges {
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
  const changes = getPlayChanges({
    deck: oldDeck,
    discard: oldDiscard,
    effectResult,
    gold: currentPlayer.gold,
    hand: oldHand,
    silver: currentPlayer.silver
  })
  return changes
}
