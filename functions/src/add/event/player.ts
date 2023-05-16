import { HistoryEvent, PlayerEvent } from '../../types'
import createPlayerEvent from '../../create/event/player'

export default function addPlayerEvent ({
  children = [],
  events,
  message,
  playerId,
  round
}: {
  children?: PlayerEvent[]
  events: HistoryEvent[]
  message: string
  playerId: string
  round?: number | undefined
}): PlayerEvent {
  const event = createPlayerEvent({
    children,
    playerId,
    round,
    message
  })
  events.push(event)
  return event
}
