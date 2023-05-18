import { MaybeSchemesPlayEvents, PlayState, PlayerEvent, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'

export default function addAreTimelineSchemeEvents ({
  playState,
  privateEvent,
  publicEvents
}: {
  playState: PlayState
  privateEvent: PlayerEvent
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
  const playEvents = { privateEvent, publicEvents }
  return { schemes: playState.game.timeline, playEvents }
}
