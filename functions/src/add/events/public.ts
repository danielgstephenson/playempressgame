import { PlayState, Player, PlayerPublicEvents, Result } from '../../types'
import createPlayerEvent from '../../create/event/player'
import createEvent from '../../create/event'

export default function addPublicEvents ({
  effectPlayer,
  message,
  playState
}: {
  effectPlayer: Result<Player>
  message: string
  playState: PlayState
}): PlayerPublicEvents {
  const observerEvent = createEvent(message)
  playState.game.history.push(observerEvent)
  const otherPlayers = playState.players.filter(player => player.id !== effectPlayer.id)
  const otherPlayerEvents = otherPlayers.map(player => {
    const event = createPlayerEvent({
      playerId: effectPlayer.id,
      round: playState.game.round,
      message
    })
    player.history.push(event)
    return event
  })
  return { observerEvent, otherPlayerEvents }
}
