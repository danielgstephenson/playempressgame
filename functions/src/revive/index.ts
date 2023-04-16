import { createEvent } from '../create/event'
import { HistoryEvent, ReviveResult, SchemeRef } from '../types'
import reviveMultiple from './multiple'

export default function revive ({ depth, discard, hand }: {
  depth: number
  discard: SchemeRef[]
  hand: SchemeRef[]
}): ReviveResult {
  const reviveEvents: HistoryEvent[] = []
  if (depth === 0) {
    return {
      revivedDiscard: discard,
      revivedHand: hand,
      revivedList: [],
      reviveEvents
    }
  }
  const { revivedDiscard, revivedHand, revivedList } = reviveMultiple({
    discard,
    hand,
    depth
  })
  const listRanks = revivedList.map(scheme => scheme.rank).join(', ')
  if (discard.length < depth) {
    const discardEvent = createEvent(`Your discard only has ${discard.length} schemes, so you revive them all: ${listRanks}.`)
    reviveEvents.push(discardEvent)
  } else {
    const listEvent = createEvent(`You revive ${listRanks}.`)
    reviveEvents.push(listEvent)
  }
  return {
    revivedDiscard,
    revivedHand,
    revivedList,
    reviveEvents
  }
}
