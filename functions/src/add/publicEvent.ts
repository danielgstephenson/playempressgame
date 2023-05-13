import { PublicEvents } from '../types'
import addEvent from './event'

export default function addPublicEvent (effectsEvents: PublicEvents, message: string): PublicEvents {
  const observerEvent = addEvent(effectsEvents.observerEvent, message)
  const otherPlayerEvents = effectsEvents
    .otherPlayerEvents
    .map(event => addEvent(event, message))
  return { observerEvent, otherPlayerEvents }
}
