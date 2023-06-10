import getJoinedRanksGrammar from '../get/joined/ranks/grammar'
import { Result, Player, PlayState } from '../types'
import addPlayerEvent from '../add/event/player'
import addEvent from '../add/event'
import { Transaction } from 'firelord'
import discardTableau from '../discardTableau'
import setPlayState from '../setPlayState'

export default async function updateImprison ({
  currentPlayer,
  playState,
  transaction
}: {
  currentPlayer: Result<Player>
  playState: PlayState
  transaction: Transaction
}): Promise<void> {
  const imprisoned = [...playState.game.court]
  const leftmost = playState.game.timeline.shift()
  if (leftmost != null) {
    imprisoned.push(leftmost)
  }
  playState.game.court = []
  playState.game.dungeon.push(...imprisoned)
  const { grammar, joinedRanks } = getJoinedRanksGrammar(imprisoned)
  const imprisonMessage = `Everyone is ready, so ${joinedRanks} ${grammar.toBe} imprisoned in the dungeon.`
  addEvent(playState.game, imprisonMessage)
  playState.players.forEach(player => {
    const playerEndEvent = addPlayerEvent({
      container: player,
      message: imprisonMessage,
      round: playState.game.round,
      playerId: player.id
    })
    return playerEndEvent
  })
  discardTableau({
    playState
  })
  setPlayState({
    playState,
    transaction
  })
}
