import isRed from '../../../../is/red'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addTopDiscardSchemeColorEvents from './color'

export default function addTopDiscardSchemeRedEvents ({
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
    isColor: isRed,
    privateEvent,
    publicEvents
  })
}
