import isGreenOrYellow from '../../../../is/greenOrYellow'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addLastReserveColorEvents from './color'

export default function addLastReserveGreenOrYellowEvents ({
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
    isColor: isGreenOrYellow,
    privateEvent,
    publicEvents
  })
}
