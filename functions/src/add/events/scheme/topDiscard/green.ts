import isGreen from '../../../../is/green'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addTopDiscardSchemeColorEvents from './color'

export default function addTopDiscardSchemeGreenEvents ({
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
    isColor: isGreen,
    privateEvent,
    publicEvents
  })
}
