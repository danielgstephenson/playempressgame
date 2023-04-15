import { createScheme } from '../create/scheme'
import { DrawResult, Scheme } from '../types'

export default function draw ({ deck, discard, drawList }: {
  deck: Scheme[]
  discard: Scheme[]
  drawList: Scheme[]
}): DrawResult {
  if (deck.length === 0) {
    if (discard.length === 0) {
      const privelege = createScheme(1)
      return {
        drawnDeck: [],
        drawnDiscard: [],
        drawnList: [privelege]
      }
    }
    const copy = [...discard]
    const flippedDiscard = copy.reverse()
    const drawResult = draw({ deck: flippedDiscard, discard: [], drawList })
    return drawResult
  }
  const drawnDeck = deck.slice(0, -1)
  const topScheme = deck.slice(-1)
  const drawnList = [...drawList, ...topScheme]
  return {
    drawnDeck,
    drawnDiscard: discard,
    drawnList
  }
}
