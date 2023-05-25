import { HistoryEvent, PlayerEvent } from '../../types'
import createPlayerEvent from '../../create/event/player'

export default function addPlayerEvent ({
  children = [],
  events,
  message,
  playerId,
  round,
  debug = false
}: {
  children?: PlayerEvent[]
  events: HistoryEvent[]
  message: string
  playerId: string
  round?: number | undefined
  debug?: boolean
}): PlayerEvent {
  if (debug) {
    console.log('events before', events)
  }
  const event = createPlayerEvent({
    children,
    playerId,
    round,
    message
  })
  if (debug) {
    console.log('event', event)
  }
  events.push(event)
  if (debug) {
    console.log('events after', events)
  }
  return event
}
