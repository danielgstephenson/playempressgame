import { HistoryEvent, MaybeSchemesPlayEvents, PlayState, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import getJoinedRanks from '../../../../../get/joined/ranks'
import getGrammar from '../../../../../get/grammar'
import isGreen from '../../../../../is/green'

export default function addAreGreenTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): MaybeSchemesPlayEvents {
  if (playState.game.timeline.length === 0) {
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: 'The timeline is empty.'
    })
    return { playEvents }
  }
  const schemes = playState.game.timeline.filter(isGreen)
  if (schemes.length === 0) {
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: 'There are no green timeline schemes.'
    })
    addTimelineEvents({
      playEvents,
      timeline: playState.game.timeline
    })
    return { playEvents }
  } else {
    const joined = getJoinedRanks(schemes)
    const grammar = getGrammar(schemes.length)
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: `The green timeline ${grammar.noun} ${grammar.toBe} ${joined}.`
    })
    addTimelineEvents({
      playEvents,
      timeline: playState.game.timeline
    })
    return { schemes, playEvents }
  }
}
