import isGreen from '../../../../is/green'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addLastReserveColorEvents from './color'

export default function addLastReserveGreenEvents ({
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
    isColor: isGreen,
    privateEvent,
    publicEvents
  })
}
