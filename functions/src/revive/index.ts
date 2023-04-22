import addEvent from '../addEvent'
import getGrammar from '../get/grammar'
import getJoinedRanks from '../get/joined/ranks'
import { HistoryEvent, ReviveResult, Scheme } from '../types'
import reviveMultiple from './multiple'

export default function revive ({
  condition = true,
  depth,
  discard,
  event,
  hand,
  message,
  nonMessage
}: {
  condition?: boolean
  depth: number
  discard: Scheme[]
  event: HistoryEvent
  hand: Scheme[]
  message?: string
  nonMessage?: string
}): ReviveResult {
  const nonResult = {
    revivedDiscard: discard,
    revivedHand: hand
  }
  if (!condition) {
    if (nonMessage != null) {
      addEvent(event, nonMessage)
    }
    return nonResult
  }
  if (depth === 0) {
    return nonResult
  }
  if (message != null) {
    addEvent(event, message)
  }
  const {
    revivedDiscard,
    revivedHand,
    revivedList
  } = reviveMultiple({
    discard,
    hand,
    depth
  })
  const listRanks = getJoinedRanks(revivedList)
  if (discard.length === 0) {
    addEvent(event, 'Your discard is empty.')
  } else if (discard.length < depth) {
    const { count, all } = getGrammar(discard.length, 'scheme', 'schemes')
    addEvent(event, `Your discard only has ${count}, ${listRanks}, so you revive ${all}.`)
  } else {
    addEvent(event, `You revive ${listRanks}.`)
  }
  return {
    revivedDiscard,
    revivedHand
  }
}
