import { ReviveData, SchemeRef } from '../types'

export default function reviveOne ({ discard, hand, list = [] }: {
  discard: SchemeRef[]
  hand: SchemeRef[]
  list?: SchemeRef[]
}): ReviveData {
  if (discard.length === 0) {
    return {
      revivedDiscard: [],
      revivedHand: hand,
      revivedList: list
    }
  }
  const revivedDiscard = discard.slice(0, -1)
  const topScheme = discard.slice(-1)
  const revivedHand = [...hand, ...topScheme]
  const revivedList = [...list, ...topScheme]
  return {
    revivedDiscard,
    revivedHand,
    revivedList
  }
}
