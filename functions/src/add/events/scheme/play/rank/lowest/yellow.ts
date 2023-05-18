import guardLowestRankYellowPlayScheme from '../../../../../../guard/lowestRankYellowPlayScheme'
import { PlayState, PlayerEvent, PublicEvents, SchemePlayEvents } from '../../../../../../types'
import addSortedPlayerEvents from '../../../../player/sorted'

export default function addLowestRankYellowPlaySchemeEvents ({
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
  const scheme = guardLowestRankYellowPlayScheme(playState.players)
  const rank = String(scheme.rank)
  const message = `The lowest rank yellow scheme in play is ${rank}.`
  const playRankEvents = addSortedPlayerEvents({
    publicEvents,
    privateEvent,
    publicMessage: message,
    privateMessage: message,
    playerId,
    playState,
    templateCallback: scheme => `which is ${scheme.color}`
  })
  return { scheme, playEvents: playRankEvents }
}
