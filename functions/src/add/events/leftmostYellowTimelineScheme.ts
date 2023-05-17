import guardDefined from '../../guard/defined'
import isYellow from '../../is/yellow'
import { MaybeSchemePlayEvents, PlayState, PlayerEvent, PublicEvents } from '../../types'
import addEventsEverywhere from './everywhere'
import addTimelineEvents from './timeline'

export default function addLeftmostYellowTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
  playerId: string
}): MaybeSchemePlayEvents {
  const yellowSchemes = playState.game.timeline.filter(isYellow)
  if (playState.game.timeline.length === 0) {
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: 'The timeline is empty.'
    })
    return { playEvents }
  } else if (yellowSchemes.length === 0) {
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: 'There are no yellow timeline schemes.'
    })
    addTimelineEvents({
      playEvents,
      timeline: playState.game.timeline
    })
    return { playEvents }
  } else {
    const yellowScheme = yellowSchemes[0]
    const scheme = guardDefined(yellowScheme, 'Leftmost yellow timeline scheme')
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: `The leftmost yellow timeline scheme is ${scheme.rank}.`
    })
    addTimelineEvents({
      playEvents,
      timeline: playState.game.timeline
    })
    return { scheme, playEvents }
  }
}
