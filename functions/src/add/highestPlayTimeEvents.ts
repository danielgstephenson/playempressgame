import guardHighestTime from '../guard/highestTime'
import { LowestPlayTimeEvents, PlayState, PlayerEvent, PublicEvents } from '../types'
import addPlayTimeEvents from './playTimeEvents'

export default function addHighestPlayTimeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: PlayerEvent
  publicEvents: PublicEvents
  playerId: string
}): LowestPlayTimeEvents {
  const time = guardHighestTime(playState.players)
  const highestTimeString = String(time)
  const timeMessage = `The highest time in play is ${highestTimeString}.`
  const playTimeEvents = addPlayTimeEvents({
    privateEvent,
    publicEvents,
    playerId,
    playState,
    timeMessage
  })
  return {
    time,
    playTimeEvents
  }
}
