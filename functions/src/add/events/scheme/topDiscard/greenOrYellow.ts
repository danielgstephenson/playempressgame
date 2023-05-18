import isGreenOrYellow from '../../../../is/greenOrYellow'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addTopDiscardSchemeColorEvents from './color'

export default function addTopDiscardSchemeGreenOrYellowEvents ({
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
    isColor: isGreenOrYellow,
    privateEvent,
    publicEvents
  })
}
