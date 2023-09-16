import createEvent from '.'
import { HistoryEvent, PlayerEvent } from '../../types'

export default function createPlayerEvent ({
  message,
  children = [],
  round,
  playerId,
  roundEvent
}: {
  message: string
  children?: HistoryEvent[]
  round?: number | undefined
  playerId: string
  roundEvent?: boolean | undefined
}): PlayerEvent {
  const event = createEvent(message, children, roundEvent)
  if (round != null) {
    event.round = round
  }
  return {
    ...event,
    playerId
  }
}
