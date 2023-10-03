import getLastScheme from '../../../../get/lastScheme'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEvent from '../../../event'
import addPublicEvent from '../../../event/public'

export default function addLastReserveSchemeEvents ({
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
  const scheme = getLastScheme(reserve)
  if (scheme == null) {
    addPublicEvent(publicEvents, `${displayName}'s reserve is empty.`)
    addEvent(privateEvent, 'Your reserve is empty.')
    return
  }
  return scheme
}
