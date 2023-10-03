import isYellow from '../../../../is/yellow'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addLastReserveColorEvents from './color'

export default function addLastReserveYellowEvents ({
  reserve,
  displayName,
  privateEvent,
  publicEvents
}: {
  reserve: Scheme[]
  displayName: string
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): Scheme | undefined {
  return addLastReserveColorEvents({
    reserve,
    displayName,
    isColor: isYellow,
    privateEvent,
    publicEvents
  })
}
