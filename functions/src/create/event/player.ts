import createEvent from '.'
import { HistoryEvent, PlayerEvent } from '../../types'

export default function createPlayerEvent ({
  message,
  children = [],
  round,
  playerId
}: {
  message: string
  children?: HistoryEvent[]
  round?: number | undefined
  playerId: string
}): PlayerEvent {
  const event = createEvent(message, children)
  if (round != null) {
    event.round = round
  }
  return {
    ...event,
    playerId
  }
}
