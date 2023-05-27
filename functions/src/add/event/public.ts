import { PublicEvents } from '../../types'
import addEvent from '.'

export default function addPublicEvent (
  publicEvents: PublicEvents,
  message: string,
  debug: boolean = false
): PublicEvents {
  if (debug) {
    console.debug('message', message)
    console.debug('publicEvents', publicEvents)
  }
  const observerEvent = addEvent(publicEvents.observerEvent, message)
  const otherPlayerEvents = publicEvents
    .otherPlayerEvents
    .map(otherPlayerEvent => {
      const playerEvent = addEvent(otherPlayerEvent, message)
      if (debug) {
        console.debug('playerEvent', playerEvent)
      }
      return playerEvent
    })
  if (debug) {
    console.debug('otherPlayerEvents', otherPlayerEvents)
  }
  return { observerEvent, otherPlayerEvents }
}
