import { HistoryEvent, MaybeSchemesPlayEvents, PlayState, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import isRed from '../../../../../is/red'
import getJoinedRanks from '../../../../../get/joined/ranks'
import getGrammar from '../../../../../get/grammar'

export default function addAreRedTimelineSchemeEvents ({
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
  const schemes = playState.game.timeline.filter(isRed)
  if (schemes.length === 0) {
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: 'There are no red timeline schemes.'
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
      message: `The red timeline ${grammar.noun} ${grammar.toBe} ${joined}.`
    })
    addTimelineEvents({
      playEvents,
      timeline: playState.game.timeline
    })
    return { schemes, playEvents }
  }
}
