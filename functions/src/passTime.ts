import createEvent from './create/event'
import guardHandScheme from './guard/handScheme'
import guardTime from './guard/time'
import { HistoryEvent, PassTime, Player, Result, Scheme } from './types'
import guardScheme from './guard/scheme'
import getJoinedRanks from './get/joined/ranks'

export default function passTime ({ allPlayers, currentPlayerId, timeline }: {
  allPlayers: Array<Result<Player>>
  currentPlayerId: string
  timeline: Scheme[]
}): PassTime {
  const timeEvents: HistoryEvent[] = [] 
  const totalTime = allPlayers.reduce((total, player) => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playScheme?.id, label: 'Pass time play scheme'
    })
    const time = guardTime(playScheme.rank)
    const displayName = player.id === currentPlayerId ? 'You' : player.displayName
    const message = `${displayName} played scheme ${playScheme.rank} with ${time} time.`
    const event = createEvent(message)
    timeEvents.push(event)
    return total + time
  }, 0)
  const totalMessage = `The total time is ${totalTime}`
  const timePasses = totalTime > allPlayers.length
  if (timePasses) {
    const [passed, ...remaining] = timeline
    const passedRank = String(passed?.rank)
    const timeResult = `more than the ${allPlayers.length} players, so ${passedRank} is removed from the timeline.`
    const timeEvent = createEvent(`${totalMessage}, ${timeResult}`)
    const beforeJoined = getJoinedRanks(timeline)
    const before = createEvent(`The timeline was ${beforeJoined}.`)
    const afterJoined = getJoinedRanks(remaining)
    const after = createEvent(`The timeline is now ${afterJoined}.`)
    timeEvent.children = [...timeEvents, before, after]
    const passedTimeline = remaining.map(ref => guardScheme({ ref }))
    return {
      passedTimeline,
      timeEvent
    }
  }
  const timeResult = `not more than the ${allPlayers.length} players, so time does not pass.`
  const timeEvent = createEvent(`The total time is ${totalTime}, ${timeResult}`)
  timeEvent.children = timeEvents
  const passedTimeline = timeline.map(ref => guardScheme({ ref }))
  return {
    passedTimeline,
    timeEvent,
  }
}
