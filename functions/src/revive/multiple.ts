import { ReviveData, Scheme } from '../types'
import reviveOne from './one'

export default function reviveMultiple ({
  depth,
  discard,
  hand,
  list = []
}: {
  depth: number
  hand: Scheme[]
  discard: Scheme[]
  list?: Scheme[]
}): ReviveData {
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
