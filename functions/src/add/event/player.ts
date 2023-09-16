import { EventContainer, PlayerEvent } from '../../types'
import createPlayerEvent from '../../create/event/player'

export default function addPlayerEvent ({
  children = [],
  container,
  message,
  playerId,
  round,
  roundEvent,
  debug = false
}: {
  children?: PlayerEvent[]
  container: EventContainer
  message: string
  playerId: string
  round?: number | undefined
  roundEvent?: boolean | undefined
  debug?: boolean
}): PlayerEvent {
  if (debug) {
    console.debug('events before', container.events)
  }
  const event = createPlayerEvent({
    children,
    playerId,
    round,
    message,
    roundEvent
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
