import guardHighestRankYellowPlayScheme from '../../../../../../guard/highestRankYellowPlayScheme'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PlayerPublicEvents } from '../../../../../../types'
import addEventsEverywhere from '../../../../everywhere'
import addSortedPlayerEvents from '../../../../player/sorted'

export default function addHighestRankYellowPlaySchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PlayerPublicEvents
  playerId: string
}): MaybeSchemePlayEvents {
  const scheme = guardHighestRankYellowPlayScheme(playState.players)
  if (scheme == null) {
    const playEvents = addEventsEverywhere({
      publicEvents,
      privateEvent,
      message: 'There are no yellow schemes in play.'
    })
    return { playEvents }
  }
  const rank = String(scheme.rank)
  const message = `The highest rank yellow scheme in play is ${rank}.`
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
