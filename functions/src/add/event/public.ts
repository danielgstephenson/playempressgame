import { PublicEvents } from '../../types'
import addEvent from '.'
import addPlayerEvent from './player'

export default function addPublicEvent (effectsEvents: PublicEvents, message: string): PublicEvents {
  const observerEvent = addEvent(effectsEvents.observerEvent, message)
  const otherPlayerEvents = effectsEvents
    .otherPlayerEvents
    .map(event => addPlayerEvent({
      events: event.children,
      message,
      playerId: event.playerId,
      round: event.round
    }))
  return { observerEvent, otherPlayerEvents }
}
