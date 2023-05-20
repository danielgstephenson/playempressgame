import guardHighestRankPlayScheme from '../../../../../../guard/highestRankPlayScheme'
import { PlayState, PlayerEvent, PublicEvents, SchemePlayEvents } from '../../../../../../types'
import addSortedPlayerEvents from '../../../../player/sorted'

export default function addHighestRankPlaySchemeEvents ({
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
  const scheme = guardHighestRankPlayScheme(playState.players)
  const rank = String(scheme.rank)
  const message = `The highest rank in play is ${rank}.`
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
