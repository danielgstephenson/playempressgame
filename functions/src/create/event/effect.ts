import createEvent from '.'
import { Game, HistoryEvent, Player, Result } from '../../types'

export default function createEffectEvent ({
  message,
  children = [],
  game,
  player
}: {
  message: string
  children?: HistoryEvent[]
  game: Result<Game>
  player: Result<Player>
}): HistoryEvent {
  const event = createEvent(message, children)
  event.round = game.round
  event.playerId = player.id
  return event
}
