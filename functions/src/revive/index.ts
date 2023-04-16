import { createEvent } from '../create/event'
import { ReviveResult, SchemeRef } from '../types'
import reviveMultiple from './multiple'

export default function revive ({ depth, discard, hand }: {
  depth: number
  discard: SchemeRef[]
  hand: SchemeRef[]
}): ReviveResult {
  const reviveEvents = []
  if (discard.length < depth) {
    const discardEvent = createEvent(`Your discard only has ${discard.length} schemes, so you revive ${discard.length}.`)
    reviveEvents.push(discardEvent)
  }
  const { revivedDiscard, revivedHand, revivedList } = reviveMultiple({
    discard,
    hand,
    depth
  })
  const listRanks = revivedList.map(scheme => scheme.rank).join(', ')
  const listEvent = createEvent(`You revive ${listRanks}.`)
  reviveEvents.push(listEvent)
  return {
    revivedDiscard,
    revivedHand,
    revivedList,
    reviveEvents
  }
}
