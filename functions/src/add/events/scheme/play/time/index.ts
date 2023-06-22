import { HistoryEvent, PlayState, PlayEvents, Scheme, PlayerPublicEvents } from '../../../../../types'
import addSortedPlayerEvents from '../../../player/sorted'

export default function addPlayTimeEvents ({
  privateEvent,
  publicEvents,
  playerId,
  playState,
  timeMessage
}: {
  privateEvent: HistoryEvent
  publicEvents: PlayerPublicEvents
  playerId: string
  playState: PlayState
  timeMessage: string
}): PlayEvents {
  function templateCallback (scheme: Scheme): string {
    const time = String(scheme.time)
    return `which has ${time} time`
  }
  return addSortedPlayerEvents({
    publicEvents,
    privateEvent,
    publicMessage: timeMessage,
    privateMessage: timeMessage,
    playerId,
    playState,
    templateCallback
  })
}
