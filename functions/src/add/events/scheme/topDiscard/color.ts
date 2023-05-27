import addTopDiscardSchemeEvents from '.'
import { HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEventsEverywhere from '../../everywhere'

export default function addTopDiscardSchemeColorEvents ({
  discard,
  displayName,
  isColor,
  privateEvent,
  publicEvents
}: {
  discard: Scheme[]
  displayName: string
  isColor: (scheme: Scheme) => boolean
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): Scheme | undefined {
  const scheme = addTopDiscardSchemeEvents({
    discard,
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
    suffix: `top discard scheme, ${scheme.rank}, is ${scheme.color}`,
    displayName
  })
  const color = isColor(scheme)
  if (color) {
    return scheme
  }
  return undefined
}
