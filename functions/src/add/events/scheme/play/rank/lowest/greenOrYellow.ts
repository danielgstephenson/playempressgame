import guardLowestRankGreenOrYellowPlayScheme from '../../../../../../guard/lowestRankGreenOrYellowPlayScheme copy'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PublicEvents } from '../../../../../../types'
import addEventsEverywhere from '../../../../everywhere'
import addSortedPlayerEvents from '../../../../player/sorted'

export default function addLowestRankGreenOrYellowPlaySchemeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  playerId: string
}): MaybeSchemePlayEvents {
  const scheme = guardLowestRankGreenOrYellowPlayScheme(playState.players)
  if (scheme == null) {
    const playEvents = addEventsEverywhere({
      publicEvents,
      privateEvent,
      message: 'There are no green or yellow schemes in play.'
    })
    return { playEvents }
  }
  const rank = String(scheme.rank)
  const message = `The lowest rank green or yellow scheme in play is ${rank}.`
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
