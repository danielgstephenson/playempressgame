import addEvent from './add/event'
import addPlayerEvent from './add/event/player'
import { PLAYER_CHOOSE_MESSAGE, END_AUCTION_PLAYER, OBSERVER_CHOOSE_MESSAGE } from './constants'
import getJoinedRanks from './get/joined/ranks'
import getJoinedRanksGrammar from './get/joined/ranks/grammar'
import guardDefined from './guard/defined'
import { HistoryEvent, PlayState } from './types'

export default function discardTableau ({
  observerEvent,
  playerEvents,
  playState
}: {
  observerEvent: HistoryEvent
  playState: PlayState
  playerEvents: HistoryEvent[]
}): void {
  playState.players.forEach(player => {
    Object.assign(player, END_AUCTION_PLAYER)
    if (player.tableau.length > 0) {
      player.tableau.sort((a, b) => a.rank - b.rank)
      const discardBefore = [...player.discard]
      player.discard.push(...player.tableau)
      player.tableau = []
      const joined = getJoinedRanksGrammar(player.tableau)
      const privateMessage = `You put ${joined.joinedRanks} on your discard.`
      const publicMessage = `${player.displayName} puts ${joined.joinedRanks} on their discard.`
      addEvent(observerEvent, publicMessage)
      playState.players.forEach(p => {
        const found = playerEvents.find(event => event.playerId === p.id)
        const playerEndEvent = guardDefined(found, 'Player end event')
        if (p.userId === player.userId) {
          const event = addPlayerEvent({
            container: playerEndEvent,
            message: privateMessage,
            round: playState.game.round,
            playerId: player.id
          })
          const before = getJoinedRanks(discardBefore)
          addEvent(event, `Your discard was ${before}.`)
          const after = getJoinedRanks(player.discard)
          addEvent(event, `Your discard becomes ${after}.`)
        } else {
          addPlayerEvent({
            container: playerEndEvent,
            message: publicMessage,
            round: playState.game.round,
            playerId: player.id
          })
        }
      })
    }
    addEvent(player, PLAYER_CHOOSE_MESSAGE)
  })
  playState.game.round = playState.game.round + 1
  playState.game.phase = 'play'
  addEvent(playState.game, OBSERVER_CHOOSE_MESSAGE)
}
