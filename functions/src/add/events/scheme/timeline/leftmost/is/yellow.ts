import addTimelineEvents from '../..'
import guardDefined from '../../../../../../guard/defined'
import isYellow from '../../../../../../is/yellow'
import { MaybeSchemePlayEvents, PlayState, PlayerEvent, PublicEvents } from '../../../../../../types'
import addEventsEverywhere from '../../../../everywhere'

export default function addLeftmostTimelineSchemeIsYellowEvents ({
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
  const yellow = isYellow(scheme)
  if (yellow) {
    return { scheme, playEvents }
  }
  return { playEvents }
}
