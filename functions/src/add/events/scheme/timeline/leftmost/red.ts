import guardDefined from '../../../../../guard/defined'
import { MaybeSchemePlayEvents, PlayState, PlayerEvent, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import addAreRedTimelineSchemeEvents from '../are/red'

export default function addLeftmostRedTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
}): MaybeSchemePlayEvents {
  const { schemes, playEvents: areEvents } = addAreRedTimelineSchemeEvents({
    playState,
    privateEvent,
    publicEvents
  })
  if (schemes.length === 0) return { playEvents: areEvents }
  const redScheme = schemes?.[0]
  const scheme = guardDefined(redScheme, 'Leftmost red timeline scheme')
  const playEvents = addEventsEverywhere({
    privateEvent,
    publicEvents,
    message: `The leftmost red timeline scheme is ${scheme.rank}.`
  })
  addTimelineEvents({
    playEvents,
    timeline: playState.game.timeline
  })
  return { scheme, playEvents }
}
