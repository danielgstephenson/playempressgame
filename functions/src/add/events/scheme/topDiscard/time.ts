import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEvent from '../../../event'
import addPublicEvent from '../../../event/public'
import addTopDiscardSchemeEvents from '.'

export default function addTopDiscardSchemeTimeEvents ({
  discard,
  displayName,
  privateEvent,
  publicEvents
}: {
  discard: Scheme[]
  displayName: string
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): number {
  const scheme = addTopDiscardSchemeEvents({
    discard,
    displayName,
    privateEvent,
    publicEvents
  })
  if (scheme == null) {
    return 0
  }
  addPublicEvent(publicEvents, `${displayName}'s top discard scheme is ${scheme.rank} with ${scheme.time} time.`)
  addEvent(privateEvent, `Your top discard scheme is ${scheme.rank} with ${scheme.time} time.`)
  return scheme.time
}
