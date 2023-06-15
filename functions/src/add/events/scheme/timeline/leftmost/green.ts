import guardDefined from '../../../../../guard/defined'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import addAreGreenTimelineSchemeEvents from '../are/green'

export default function addLeftmostGreenTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): MaybeSchemePlayEvents {
  const { schemes, playEvents: areEvents } = addAreGreenTimelineSchemeEvents({
    playState,
    privateEvent,
    publicEvents
  })
  console.log('schemes.length', schemes?.length)
  if (schemes.length === 0) return { playEvents: areEvents }
  const greenScheme = schemes?.[0]
  const scheme = guardDefined(greenScheme, 'Leftmost green timeline scheme')
  const playEvents = addEventsEverywhere({
    privateEvent,
    publicEvents,
    message: `The leftmost green timeline scheme is ${scheme.rank}.`
  })
  addTimelineEvents({
    playEvents,
    timeline: playState.game.timeline
  })
  return { scheme, playEvents }
}
