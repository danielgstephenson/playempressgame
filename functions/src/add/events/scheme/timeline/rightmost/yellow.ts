import guardDefined from '../../../../../guard/defined'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import addAreYellowTimelineSchemeEvents from '../are/yellow'

export default function addRightmostYellowTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): MaybeSchemePlayEvents {
  const { schemes, playEvents: areEvents } = addAreYellowTimelineSchemeEvents({
    playState,
    privateEvent,
    publicEvents
  })
  if (schemes?.length === 0) return { playEvents: areEvents }
  const yellowScheme = schemes?.[schemes.length - 1]
  const scheme = guardDefined(yellowScheme, 'Rightmost yellow timeline scheme')
  const playEvents = addEventsEverywhere({
    privateEvent,
    publicEvents,
    message: `The rightmost yellow timeline scheme is ${scheme.rank}.`
  })
  addTimelineEvents({
    playEvents,
    timeline: playState.game.timeline
  })
  return { scheme, playEvents }
}
