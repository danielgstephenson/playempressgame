import guardLowestRankPlayScheme from '../../guard/lowestRankPlayScheme'
import { PlayState, PlayerEvent, PublicEvents, SchemePlayEvents } from '../../types'
import addSortedPlayerEvents from './sortedPlayer'

export default function addLowestRankPlaySchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
  playerId: string
}): SchemePlayEvents {
  const scheme = guardLowestRankPlayScheme(playState.players)
  const rank = String(scheme.rank)
  const message = `The lowest rank in play is ${rank}.`
  const playRankEvents = addSortedPlayerEvents({
    publicEvents,
    privateEvent,
    publicMessage: message,
    privateMessage: message,
    playerId,
    playState
  })
  return { scheme, playEvents: playRankEvents }
}
