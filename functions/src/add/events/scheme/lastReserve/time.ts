import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEvent from '../../../event'
import addPublicEvent from '../../../event/public'
import addLastReserveSchemeEvents from '.'
import getGrammar from '../../../../get/grammar'

export default function addLastReserveTimeEvents ({
  reserve,
  displayName,
  privateEvent,
  publicEvents
}: {
  reserve: Scheme[]
  displayName: string
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): number {
  const scheme = addLastReserveSchemeEvents({
    reserve,
    displayName,
    privateEvent,
    publicEvents
  })
  if (scheme == null) {
    return 0
  }
  const { spelled } = getGrammar(scheme.time)
  addPublicEvent(publicEvents, `${displayName}'s last reserve is ${scheme.rank} with ${spelled} time.`)
  addEvent(privateEvent, `Your last reserve, ${scheme.rank}, has ${scheme.time} time.`)
  return scheme.time
}
