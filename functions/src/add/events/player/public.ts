import { PlayerPublicEvents } from '../../../types'
import addEvent from '../../event'
import addPlayerEvent from '../../event/player'

export default function addPlayerPublicEvents ({
  events, message, debug = false
}: {
  events: PlayerPublicEvents
  message: string
  debug?: boolean
}): PlayerPublicEvents {
  if (debug) {
    console.debug('message', message)
    console.debug('publicEvents', events)
  }
  const observerEvent = addEvent(events.observerEvent, message)
  const otherPlayerEvents = events
    .otherPlayerEvents
    .map(otherPlayerEvent => {
      const playerEvent = addPlayerEvent({
        container: otherPlayerEvent,
        message,
        playerId: otherPlayerEvent.playerId,
        round: otherPlayerEvent.round
      })
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
