import { createSchemeRef } from '../create/schemeRef'
import { DrawRefs, SchemeRef } from '../types'

export default function drawOne ({
  deck,
  discard,
  flipped = false,
  hand,
  deckDrawn = [],
  discardDrawn = [],
  privelegeTaken = []
}: {
  deck: SchemeRef[]
  discard: SchemeRef[]
  flipped?: boolean
  hand: SchemeRef[]
  deckDrawn?: SchemeRef[]
  discardDrawn?: SchemeRef[]
  privelegeTaken?: SchemeRef[]
}): DrawRefs {
  if (deck.length === 0) {
    if (discard.length === 0) {
      const privelege = createSchemeRef(1)
      return {
        deckDrawn,
        discardDrawn,
        flipped,
        privelegeTaken: [...privelegeTaken, privelege],
        drawnDeck: [],
        drawnDiscard: [],
        drawnHand: [...hand, privelege]
      }
    }
    const copy = [...discard]
    const flippedDiscard = copy.reverse()
    const drawResult = drawOne({
      deck: flippedDiscard,
      deckDrawn,
      discard: [],
      discardDrawn,
      flipped: true,
      hand,
      privelegeTaken
    })
    return drawResult
  }
  const drawnDeck = deck.slice(0, -1)
  const topScheme = deck.slice(-1)
  const drawnHand = [...hand, ...topScheme]
  const drawnRefs = {
    drawnDeck,
    drawnDiscard: discard,
    drawnHand,
    flipped,
    privelegeTaken
  }
  if (flipped) {
    return {
      ...drawnRefs,
      discardDrawn: [...discardDrawn, ...topScheme],
      deckDrawn
    }
  }
  return {
    ...drawnRefs,
    deckDrawn: [...deckDrawn, ...topScheme],
    discardDrawn
  }
}
