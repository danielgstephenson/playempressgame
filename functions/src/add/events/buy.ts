import createBuySuffixes from '../../create/buySuffixes'
import joinRanks from '../../join/ranks'
import { BuyerLoserMessages, PlayState, Scheme, TargetEvents } from '../../types'
import addEvent from '../event'
import addTargetEvents from './target'

export default function addBuyEvents ({
  beforeTimeline,
  bid,
  buyerId,
  buyerMessage,
  loserMessage,
  message,
  name,
  playState,
  rank
}: {
  beforeTimeline: Scheme[]
  bid: number
  buyerId: string
  name: string
  playState: PlayState
  rank?: number | undefined
} & BuyerLoserMessages): TargetEvents {
  const beforeTimelineJoined = joinRanks(beforeTimeline)
  const beforeTimelineMessage = `The timeline was ${beforeTimelineJoined}.`
  const afterTimeline = [...playState.game.timeline]
  const afterTimelineJoined = joinRanks(afterTimeline)
  const afterTimelineMessage = `The timeline becomes ${afterTimelineJoined}.`
  const buyerPrefix = buyerMessage ?? message
  const loserPrefix = loserMessage ?? message
  const suffixes = createBuySuffixes({
    bid,
    name,
    rank
  })
  const buyerEndMessage = `${buyerPrefix}, so ${suffixes.buyer}.`
  const loserEndMessage = `${loserPrefix}, so ${suffixes.loser}.`
  const buyEvents = addTargetEvents({
    playState,
    message: loserEndMessage,
    targetMessages: {
      [buyerId]: buyerEndMessage
    }
  })
  buyEvents.events.forEach(event => {
    addEvent(event, beforeTimelineMessage)
    addEvent(event, afterTimelineMessage)
  })
  return buyEvents
}
