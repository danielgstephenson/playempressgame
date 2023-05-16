import getTopScheme from '../../get/topScheme'
import { HistoryEvent, PublicEvents, Scheme } from '../../types'
import addEvent from '../event'
import addPublicEvent from '../event/public'

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
  const top = getTopScheme(discard)
  if (top == null) {
    addPublicEvent(publicEvents, `${displayName}'s discard is empty.`)
    addEvent(privateEvent, 'Your discard is empty.')
    return 0
  }
  addPublicEvent(publicEvents, `${displayName}'s top discard scheme is ${top.rank} with ${top.time} time.`)
  addEvent(privateEvent, `Your top discard scheme is ${top.rank} with ${top.time} time.`)
  return top.time
}
