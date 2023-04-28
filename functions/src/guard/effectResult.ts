import guardEffect from './effect'
import guardPlayHandSchemes from './playHandSchemes'
import guardSchemes from './schemes'
import { EffectResultGuard, Game, Player, Result, SchemeRef } from '../types'

export default function guardEffectResult ({
  allPlayers,
  first,
  ref,
  currentPlayer,
  currentGame,
  resume
}: {
  allPlayers: Array<Result<Player>>
  first?: boolean | undefined
  ref: SchemeRef
  currentPlayer: Result<Player>
  resume?: boolean | undefined
  currentGame: Result<Game>
}): EffectResultGuard {
  const effect = guardEffect(ref.rank)
  const deck = guardSchemes({ refs: currentPlayer.deck })
  const discard = guardSchemes({ refs: currentPlayer.discard })
  const hand = guardSchemes({ refs: currentPlayer.hand })
  const dungeon = guardSchemes({ refs: currentGame.dungeon })
  const passedTimeline = guardSchemes({ refs: currentGame.timeline })
  const playSchemes = guardPlayHandSchemes(allPlayers)
  const effectResult = effect({
    appointments: [],
    choices: [],
    deck,
    discard,
    dungeon,
    first,
    gold: currentPlayer.gold,
    passedTimeline,
    hand,
    playerId: currentPlayer.id,
    playSchemeRef: ref,
    playSchemes,
    resume,
    silver: currentPlayer.silver
  })
  return {
    effectResult,
    oldDeck: deck,
    oldDiscard: discard,
    oldDungeon: dungeon,
    oldHand: hand,
    oldPlayers: allPlayers,
    passedTimeline
  }
}
