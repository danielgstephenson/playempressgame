import isRed from '../../../../is/red'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addLastReserveColorEvents from './color'

export default function addLastReserveRedEvents ({
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
    isColor: isRed,
    privateEvent,
    publicEvents
  })
}
