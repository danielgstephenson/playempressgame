import { PublicEvents } from '../../types'
import addEvent from '.'

export default function addPublicEvent (
  publicEvents: PublicEvents,
  message: string,
  debug: boolean = false
): PublicEvents {
  if (debug) {
    console.log('message', message)
    console.log('publicEvents', publicEvents)
  }
  const observerEvent = addEvent(publicEvents.observerEvent, message)
  const otherPlayerEvents = publicEvents
    .otherPlayerEvents
    .map(otherPlayerEvent => {
      const playerEvent = addEvent(otherPlayerEvent, message)
      if (debug) {
        console.log('playerEvent', playerEvent)
      }
      return playerEvent
    })
  if (debug) {
    console.log('otherPlayerEvents', otherPlayerEvents)
  }
  return { observerEvent, otherPlayerEvents }
}
