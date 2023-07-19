import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PlayerPublicEvents } from '../../../../../types'
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
  privateEvent: HistoryEvent
  publicEvents: PlayerPublicEvents
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
    return { scheme, playEvents }
  }
  const playEvents = addEventsEverywhere({
    publicEvents,
    privateEvent,
    message: `${scheme.rank} is not lower than ${rank}`
  })
  return { playEvents }
}
