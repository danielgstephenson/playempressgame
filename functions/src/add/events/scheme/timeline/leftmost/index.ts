import guardDefined from '../../../../../guard/defined'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PublicEvents, Scheme } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import addAreTimelineSchemeEvents from '../are'

export default function addLeftmostTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  templateCallback
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  templateCallback?: (scheme: Scheme) => string
}): MaybeSchemePlayEvents {
  const { schemes, playEvents: areEvents } = addAreTimelineSchemeEvents({
    playState,
    privateEvent,
    publicEvents
  })
  if (schemes?.length === 0) return { playEvents: areEvents }
  const leftmostScheme = schemes?.[0]
  const scheme = guardDefined(leftmostScheme, 'Leftmost timeline scheme')
  const leftmostMessage = `The leftmost timeline scheme is ${scheme.rank}`
  const message = templateCallback == null
    ? `${leftmostMessage}.`
    : `${leftmostMessage}, ${templateCallback(scheme)}.`
  const playEvents = addEventsEverywhere({
    privateEvent,
    publicEvents,
    message
  })
  addTimelineEvents({
    playEvents,
    timeline: playState.game.timeline
  })
  return { scheme, playEvents }
}
