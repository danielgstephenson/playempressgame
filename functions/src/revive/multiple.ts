import { ReviveResult, Scheme } from '../types'
import revive from '.'

export default function reviveMultiple ({
  depth,
  reviveList,
  discard
}: {
  depth: number
  reviveList: Scheme[]
  discard: Scheme[]
}): ReviveResult {
  if (depth === 0) {
    return {
      revivedList: reviveList,
      revivedDiscard: discard
    }
  }
  const { revivedList, revivedDiscard } = revive({ reviveList, discard })
  return reviveMultiple({ depth: depth - 1, reviveList: revivedList, discard: revivedDiscard })
}
