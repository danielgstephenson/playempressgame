import { Transaction, arrayUnion } from 'firelord'
import createEvent from '../create/event'
import getJoinedRanksGrammar from '../get/joined/ranks/grammar'
import { Result, Game, Player, HistoryEvent } from '../types'
import updateEndAuction from './endAuction'

export default function updateImprison ({
  currentGame,
  currentPlayer,
  privateReadyEvent,
  publicReadyEvent,
  transaction
}: {
  currentGame: Result<Game>
  currentPlayer: Result<Player>
  privateReadyEvent: HistoryEvent
  publicReadyEvent: HistoryEvent
  transaction: Transaction
}): void {
  const imprisoned = [...currentGame.court]
  const leftmost = currentGame.timeline[0]
  if (leftmost != null) {
    imprisoned.push(leftmost)
  }
  const { grammar, joinedRanks } = getJoinedRanksGrammar(imprisoned)
  const endEvent = createEvent(`Everyone is ready to imprison, so ${joinedRanks} ${grammar.toBe} imprisoned in the dungeon.`)
  updateEndAuction({
    currentGame,
    currentPlayer,
    gameChanges: {
      court: [],
      dungeon: arrayUnion(...imprisoned),
      phase: 'play'
    },
    privateReadyEvent,
    publicReadyEvent,
    publicEndEvent: endEvent,
    transaction
  })
}
