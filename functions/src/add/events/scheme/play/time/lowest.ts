import guardLowestPlayTime from '../../../../../guard/lowestPlayTime'
import { PlayTimeEvents, PlayState, PublicEvents, HistoryEvent } from '../../../../../types'
import addPlayTimeEvents from '.'

export default function addLowestPlayTimeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  playerId: string
}): PlayTimeEvents {
  const time = guardLowestPlayTime(playState.players)
  const lowestTimeString = String(time)
  const timeMessage = `The lowest time in play is ${lowestTimeString}`
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
