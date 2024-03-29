import isYellow from '../../../../is/yellow'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addTopDiscardSchemeColorEvents from './color'

export default function addTopDiscardSchemeYellowEvents ({
  discard,
  displayName,
  privateEvent,
  publicEvents
}: {
  discard: Scheme[]
  displayName: string
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): Scheme | undefined {
  return addTopDiscardSchemeColorEvents({
    discard,
    displayName,
    isColor: isYellow,
    privateEvent,
    publicEvents
  })
}
