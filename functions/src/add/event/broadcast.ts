import createEvent from '../../create/event'
import { Player, Game, Result, HistoryEvent } from '../../types'

export default function addBroadcastEvent ({
  players,
  game,
  message
}: {
  players: Array<Result<Player>>
  game: Result<Game>
  message: string
}): HistoryEvent {
  const event = createEvent(message)
  game.history.push(event)
  players.forEach(player => {
    player.history.push(event)
  })
  return event
}
