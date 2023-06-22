import guardHighestPlayTime from '../../../../../guard/highestPlayTime'
import { PlayTimeEvents, PlayState, HistoryEvent, PlayerPublicEvents } from '../../../../../types'
import addPlayTimeEvents from '.'

export default function addHighestPlayTimeEvents ({
  playState,
  privateEvent,
  publicEvents,
  playerId
}: {
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PlayerPublicEvents
  playerId: string
}): PlayTimeEvents {
  const time = guardHighestPlayTime(playState.players)
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
