import guardLowestTime from '../guard/lowestTime'
import { LowestPlayTimeEvents, PlayState, PlayerEvent, PublicEvents } from '../types'
import addPlayTimeEvents from './playTimeEvents'

export default function addLowestPlayTimeEvents ({
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
  const time = guardLowestTime(playState.players)
  const lowestTimeString = String(time)
  const timeMessage = `The lowest time in play is ${lowestTimeString}.`
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
