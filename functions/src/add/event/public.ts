import { PublicEvents } from '../../types'
import addEvent from '.'
import addPlayerEvent from './player'

export default function addPublicEvent (publicEvents: PublicEvents, message: string): PublicEvents {
  const observerEvent = addEvent(publicEvents.observerEvent, message)
  const otherPlayerEvents = publicEvents
    .otherPlayerEvents
    .map(event => addPlayerEvent({
      events: event.children,
      message,
      playerId: event.playerId,
      round: event.round
    }))
  return { observerEvent, otherPlayerEvents }
}
