import { HistoryEvent, MaybeSchemesPlayEvents, PlayState, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addTimelineEvents from '..'
import getJoinedRanks from '../../../../../get/joined/ranks'
import getGrammar from '../../../../../get/grammar'
import isGreen from '../../../../../is/green'

export default function addAreGreenTimelineSchemeEvents ({
  addList = true,
  playState,
  privateEvent,
  publicEvents
}: {
  addList?: boolean
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
    return { playEvents, schemes: [] }
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
    return { playEvents, schemes: [] }
  } else if (addList) {
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
  } else {
    return { schemes }
  }
}
