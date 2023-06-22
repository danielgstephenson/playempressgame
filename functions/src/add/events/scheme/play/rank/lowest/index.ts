import guardLowestRankPlayScheme from '../../../../../../guard/lowestRankPlayScheme'
import { HistoryEvent, PlayState, PlayerPublicEvents, SchemePlayEvents } from '../../../../../../types'
import addSortedPlayerEvents from '../../../../player/sorted'

export default function addLowestRankPlaySchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PlayerPublicEvents
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
