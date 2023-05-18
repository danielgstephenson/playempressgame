import getTopScheme from '../../../../get/topScheme'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEvent from '../../../event'
import addPublicEvent from '../../../event/public'

export default function addTopDiscardSchemeEvents ({
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
  const scheme = getTopScheme(discard)
  if (scheme == null) {
    addPublicEvent(publicEvents, `${displayName}'s discard is empty.`)
    addEvent(privateEvent, 'Your discard is empty.')
    return
  }
  return scheme
}
