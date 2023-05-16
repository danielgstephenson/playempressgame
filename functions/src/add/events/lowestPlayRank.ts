import guardLowestRankPlayScheme from '../../guard/lowestRankPlayScheme'
import { PlayState, PlayerEvent, PublicEvents, PlayRankEvents } from '../../types'
import addSortedPlayerEvents from './sortedPlayer'

export default function addLowestPlayRankEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
  playerId: string
}): PlayRankEvents {
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
  return { scheme, playRankEvents }
}
