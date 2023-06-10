import getJoinedRanksGrammar from '../get/joined/ranks/grammar'
import { Result, Player, PlayState } from '../types'
import addPlayerEvent from '../add/event/player'
import addEvent from '../add/event'
import { Transaction } from 'firelord'
import updatePlayState from '../updatePlayState'
import discardTableau from '../discardTableau'

export default function updateImprison ({
  currentPlayer,
  playState,
  transaction
}: {
  currentPlayer: Result<Player>
  playState: PlayState
  transaction: Transaction
}): void {
  const imprisoned = [...playState.game.court]
  const leftmost = playState.game.timeline.shift()
  if (leftmost != null) {
    imprisoned.push(leftmost)
  }
  playState.game.court = []
  playState.game.dungeon.push(...imprisoned)
  const { grammar, joinedRanks } = getJoinedRanksGrammar(imprisoned)
  const imprisonMessage = `Everyone is ready to imprison, so ${joinedRanks} ${grammar.toBe} imprisoned in the dungeon.`
  const observerEndEvent = addEvent(playState.game, imprisonMessage)
  const playerEndEvents = playState.players.map(player => {
    const playerEndEvent = addPlayerEvent({
      container: player,
      message: imprisonMessage,
      round: playState.game.round,
      playerId: player.id
    })
    return playerEndEvent
  })
  discardTableau({
    observerEvent: observerEndEvent,
    playerEvents: playerEndEvents,
    playState
  })
  updatePlayState({
    playState,
    transaction
  })
}
