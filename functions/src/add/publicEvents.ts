import { HistoryEvent, PlayState, Player, PublicEvents, Result } from '../types'
import createPlayerEvent from '../create/event/player'
import createEvent from '../create/event'

export default function addPublicEvents ({
  children = [],
  effectPlayer,
  message,
  playState
}: {
  children?: HistoryEvent[]
  effectPlayer: Result<Player>
  message: string
  playState: PlayState
}): PublicEvents {
  const observerEvent = createEvent(message, children)
  playState.game.history.push(observerEvent)
  const otherPlayers = playState.players.filter(player => player.id !== effectPlayer.id)
  const otherPlayerEvents = otherPlayers.map(player => {
    const event = createPlayerEvent({
      children,
      playerId: player.id,
      round: playState.game.round,
      message
    })
    player.history.push(event)
    return event
  })
  return { observerEvent, otherPlayerEvents }
}
