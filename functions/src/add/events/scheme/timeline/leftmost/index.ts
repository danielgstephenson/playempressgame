import guardDefined from '../../../../../guard/defined'
import { MaybeSchemePlayEvents, PlayState, PlayerEvent, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import addAreTimelineSchemeEvents from '../are'

export default function addLeftmostTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
}): MaybeSchemePlayEvents {
  const { schemes, playEvents: areEvents } = addAreTimelineSchemeEvents({
    playState,
    privateEvent,
    publicEvents
  })
  if (schemes?.length === 0) return { playEvents: areEvents }
  const leftmostScheme = schemes?.[0]
  const scheme = guardDefined(leftmostScheme, 'Leftmost timeline scheme')
  const playEvents = addEventsEverywhere({
    privateEvent,
    publicEvents,
    message: `The leftmost timeline scheme is ${scheme.rank}.`
  })
  addTimelineEvents({
    playEvents,
    timeline: playState.game.timeline
  })
  return { scheme, playEvents }
}
