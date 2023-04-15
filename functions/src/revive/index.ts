import { ReviveResult, Scheme } from '../types'

export default function revive ({ discard, reviveList }: {
  discard: Scheme[]
  reviveList: Scheme[]
}): ReviveResult {
  if (discard.length === 0) {
    return {
      revivedDiscard: [],
      revivedList: []
    }
  }
  const revivedDiscard = discard.slice(0, -1)
  const topScheme = discard.slice(-1)
  const revivedList = [...reviveList, ...topScheme]
  return {
    revivedDiscard,
    revivedList
  }
}
