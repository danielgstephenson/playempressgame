import addLastReserveEvents from '.'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEventsEverywhere from '../../everywhere'

export default function addLastReserveColorEvents ({
  reserve,
  displayName,
  isColor,
  privateEvent,
  publicEvents
}: {
  reserve: Scheme[]
  displayName: string
  isColor: (scheme: Scheme) => boolean
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): Scheme | undefined {
  const scheme = addLastReserveEvents({
    reserve,
    displayName,
    privateEvent,
    publicEvents
  })
  if (scheme == null) {
    return
  }
  addEventsEverywhere({
    publicEvents,
    privateEvent,
    suffix: `last reserve, ${scheme.rank}, is ${scheme.color}`,
    displayName
  })
  const color = isColor(scheme)
  if (color) {
    return scheme
  }
  return undefined
}
