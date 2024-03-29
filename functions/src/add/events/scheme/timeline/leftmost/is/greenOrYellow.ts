import addTimelineEvents from '../..'
import guardDefined from '../../../../../../guard/defined'
import isGreenOrYellow from '../../../../../../is/greenOrYellow'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PublicEvents } from '../../../../../../types'
import addEventsEverywhere from '../../../../everywhere'

export default function addLeftmostTimelineSchemeIsGreenOrYellowEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  playerId: string
}): MaybeSchemePlayEvents {
  if (playState.game.timeline.length === 0) {
    const playEvents = addEventsEverywhere({
      privateEvent,
      publicEvents,
      message: 'The timeline is empty.'
    })
    return { playEvents }
  }
  const scheme = guardDefined(playState.game.timeline[0], 'Leftmost timeline scheme')
  const message = `The leftmost timeline scheme, ${scheme.rank}, is ${scheme.color}.`
  const playEvents = addEventsEverywhere({
    privateEvent,
    publicEvents,
    message
  })
  addTimelineEvents({
    playEvents,
    timeline: playState.game.timeline
  })
  const greenOrYellow = isGreenOrYellow(scheme)
  if (greenOrYellow) {
    return { scheme, playEvents }
  }
  return { playEvents }
}
