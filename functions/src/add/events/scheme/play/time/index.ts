import { HistoryEvent, PlayState, PlayEvents, PublicEvents, Scheme } from '../../../../../types'
import addSortedPlayerEvents from '../../../player/sorted'

export default function addPlayTimeEvents ({
  privateEvent,
  publicEvents,
  playerId,
  playState,
  timeMessage
}: {
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  playerId: string
  playState: PlayState
  timeMessage: string
}): PlayEvents {
  function templateCallback (scheme: Scheme): string {
    const time = String(scheme.time)
    return `which has ${time} time.`
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
