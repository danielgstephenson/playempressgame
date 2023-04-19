import createEvent from './create/event'
import guardHandScheme from './guard/handScheme'
import guardTime from './guard/time'
import { PassTime, Player, SchemeRef } from './types'
import guardScheme from './guard/scheme'

export default function passTime ({ allPlayers, timeline }: {
  allPlayers: Array<Player['read']>
  timeline: SchemeRef[]
}): PassTime {
  const totalTime = allPlayers.reduce((total, player) => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playId, label: 'Play scheme'
    })
    const time = guardTime(playScheme.rank)
    return total + time
  }, 0)
  const totalMessage = `The total time is ${totalTime}`
  const timePasses = totalTime > allPlayers.length
  if (timePasses) {
    const [passed, ...remaining] = timeline
    const passedRank = String(passed?.rank)
    const timeResult = `more than the ${allPlayers.length} players, so ${passedRank} is removed from the timeline.`
    const timeEvent = createEvent(`${totalMessage}, ${timeResult}`)
    const passedTimeline = remaining.map(ref => guardScheme({ ref }))
    return {
      passedTimeline,
      timeEvent
    }
  }
  const timeResult = `not more than the ${allPlayers.length} players, so time does not pass.`
  const timeEvent = createEvent(`The total time is ${totalTime}, ${timeResult}`)
  const passedTimeline = timeline.map(ref => guardScheme({ ref }))
  return {
    passedTimeline,
    timeEvent
  }
}
