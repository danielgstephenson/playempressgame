import { EventContainer, PlayerEvent } from '../../types'
import createPlayerEvent from '../../create/event/player'

export default function addPlayerEvent ({
  children = [],
  container,
  message,
  playerId,
  round,
  debug = false
}: {
  children?: PlayerEvent[]
  container: EventContainer
  message: string
  playerId: string
  round?: number | undefined
  debug?: boolean
}): PlayerEvent {
  if (debug) {
    console.debug('events before', container.events)
  }
  const event = createPlayerEvent({
    children,
    playerId,
    round,
    message
  })
  if (debug) {
    console.debug('event', event)
  }
  container.events.push(event)
  if (debug) {
    console.debug('events after', container.events)
  }
  return event
}
