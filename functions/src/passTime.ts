import { DocumentReference, Transaction } from 'firelord'
import { createEvent } from './create/event'
import guardHandScheme from './guard/handScheme'
import guardTime from './guard/time'
import { Game, PassTime, Player, SchemeRef } from './types'

export default function passTime ({ allPlayers, gameRef, timeline, transaction }: {
  allPlayers: Array<Player['read']>
  gameRef: DocumentReference<Game>
  timeline: SchemeRef[]
  transaction: Transaction
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
    return {
      passedTimeline: remaining,
      timeEvent
    }
  }
  const timeResult = `not more than the ${allPlayers.length} players, so time does not pass.`
  const timeEvent = createEvent(`The total time is ${totalTime}, ${timeResult}`)
  return {
    passedTimeline: timeline,
    timeEvent
  }
}
