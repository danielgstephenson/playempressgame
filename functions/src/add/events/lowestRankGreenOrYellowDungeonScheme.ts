import guardLowestRankGreenOrYellowDungeonScheme from '../../guard/lowestRankGreenOrYellowDungeonScheme'
import { PlayState, PlayerEvent, PublicEvents, SchemePlayEvents } from '../../types'
import addEventsEverywhere from './everywhere'

export default function addLowestRankGreenOrYellowDungeonSchemeEvents ({
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
  const scheme = guardLowestRankGreenOrYellowDungeonScheme(playState.game)
  const rank = String(scheme.rank)
  const message = `The lowest rank green or yellow dungeon scheme is ${rank}.`
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
