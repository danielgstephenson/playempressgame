import { createSchemeRef } from '../create/schemeRef'
import { DrawRefs, SchemeRef } from '../types'

export default function drawOne ({ deck, discard, hand }: {
  deck: SchemeRef[]
  discard: SchemeRef[]
  hand: SchemeRef[]
}): DrawRefs {
  if (deck.length === 0) {
    if (discard.length === 0) {
      const privelege = createSchemeRef(1)
      return {
        drawnDeck: [],
        drawnDiscard: [],
        drawnHand: [...hand, privelege]
      }
    }
    const copy = [...discard]
    const flippedDiscard = copy.reverse()
    const drawResult = drawOne({ deck: flippedDiscard, discard: [], hand })
    return drawResult
  }
  const drawnDeck = deck.slice(0, -1)
  const topScheme = deck.slice(-1)
  const drawnHand = [...hand, ...topScheme]
  return {
    drawnDeck,
    drawnDiscard: discard,
    drawnHand
  }
}
