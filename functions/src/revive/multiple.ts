import { ReviveRefs, SchemeRef } from '../types'
import reviveOne from './one'

export default function reviveMultiple ({
  depth,
  discard,
  hand,
  list = []
}: {
  depth: number
  hand: SchemeRef[]
  discard: SchemeRef[]
  list?: SchemeRef[]
}): ReviveRefs {
  if (depth === 0) {
    return {
      revivedHand: hand,
      revivedDiscard: discard,
      revivedList: list
    }
  }
  const { revivedHand, revivedDiscard, revivedList } = reviveOne({ hand, discard, list })
  return reviveMultiple({ depth: depth - 1, hand: revivedHand, discard: revivedDiscard, list: revivedList })
}
