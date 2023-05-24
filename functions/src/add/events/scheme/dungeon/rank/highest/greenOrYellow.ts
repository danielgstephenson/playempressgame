import guardHighestRankGreenOrYellowDungeonScheme from '../../../../../../guard/highestRankGreenOrYellowDungeonScheme'
import { HistoryEvent, MaybeSchemePlayEvents, PlayState, PublicEvents } from '../../../../../../types'
import addEventsEverywhere from '../../../../everywhere'

export default function addHighestRankGreenOrYellowDungeonSchemeEvents ({
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
  const scheme = guardHighestRankGreenOrYellowDungeonScheme(playState.game)
  if (scheme == null) {
    const playEvents = addEventsEverywhere({
      publicEvents,
      privateEvent,
      message: 'There are no green or yellow dungeon schemes.'
    })
    return { playEvents }
  }
  const rank = String(scheme.rank)
  const message = `The highest rank green or yellow dungeon scheme is ${rank}.`
  const playEvents = addEventsEverywhere({
    publicEvents,
    privateEvent,
    message
  })
  playState.game.dungeon.forEach(scheme => {
    addEventsEverywhere({
      playEvents,
      message: `${scheme.rank} is ${scheme.color}.`
    })
  })
  return { scheme, playEvents }
}
