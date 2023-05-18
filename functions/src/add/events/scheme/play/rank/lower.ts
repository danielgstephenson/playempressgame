import { MaybeSchemePlayEvents, PlayState, PlayerEvent, PublicEvents } from '../../../../../types'
import addEventsEverywhere from '../../../everywhere'
import addLowestRankPlaySchemeEvents from './lowest'

export default function addLowerRankPlaySchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  rank,
  playerId
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
  rank: number
  playerId: string
}): MaybeSchemePlayEvents {
  const { scheme } = addLowestRankPlaySchemeEvents({
    playState,
    privateEvent,
    publicEvents,
    playerId
  })
  const rankLower = scheme.rank > rank
  if (rankLower) {
    const playEvents = addEventsEverywhere({
      publicEvents,
      privateEvent,
      message: `${rank} is lower than ${scheme.rank}`
    })
    return { playEvents }
  }
  const playEvents = addEventsEverywhere({
    publicEvents,
    privateEvent,
    message: `${scheme.rank} is lower than ${rank}`
  })
  return { scheme, playEvents }
}
