import createEvent from './create/event'
import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import { HistoryEvent, PassTime, Player, Result, SchemeRef } from './types'
import guardScheme from './guard/scheme'
import getJoinedRanks from './get/joined/ranks'
import { PlayState } from '../types'
import guardPlayHandScheme from '../guard/playHandScheme'

export default function passTimeState ({ playState }: {
  playState: PlayState
}): PlayState {
  const totalTime = playState.players.reduce((total, player) => {
    const playScheme = guardPlayHandScheme(player)
    const time = guardTime(playScheme.rank)
    return total + time
  }, 0)
  const totalMessage = `The total time is ${totalTime}`
  const timePasses = totalTime > playState.players.length
  if (timePasses) {
    const [passed, ...remaining] = playState.game.timeline
    const passedRank = String(passed?.rank)
    const timeResult = `more than the ${playState.players.length} players, so ${passedRank} is removed from the timeline.`
    const timeEvent = createEvent(`${totalMessage}, ${timeResult}`)
    const beforeJoined = getJoinedRanks(timeline)
    const beforeEvent = createEvent(`The timeline was ${beforeJoined}.`)
    const afterJoined = getJoinedRanks(remaining)
    const afterEvent = createEvent(`The timeline is now ${afterJoined}.`)
    playState.players.forEach(player => {
      const timeEvents = playState.players.map(player => {
        const playScheme = guardPlayHandScheme(player)
        const time = guardTime(playScheme.rank)
        const displayName = player.id === currentPlayerId ? 'You' : player.displayName
        const message = `${displayName} played scheme ${playScheme.rank} with ${time} time.`
        const event = createEvent(message)
      })
      timeEvent.children = [...timeEvents, beforeEvent, afterEvent]
      player.history.push(timeEvent)
    })
    const passedTimeline = remaining.map(ref => guardScheme({ ref }))
    return playState
  }
  const timeResult = `not more than the ${allPlayers.length} players, so time does not pass.`
  const timeEvent = createEvent(`The total time is ${totalTime}, ${timeResult}`)
  timeEvent.children = timeEvents
  const passedTimeline = timeline.map(ref => guardScheme({ ref }))
  return {
    passedTimeline,
    timeEvent
  }
}
