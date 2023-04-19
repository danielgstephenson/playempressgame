import guardScheme from '../guard/scheme'
import { DrawData, Scheme } from '../types'

export default function drawOne ({
  deck,
  discard,
  flipped = false,
  hand,
  deckDrawn = [],
  discardDrawn = [],
  privelegeTaken = []
}: {
  deck: Scheme[]
  discard: Scheme[]
  flipped?: boolean
  hand: Scheme[]
  deckDrawn?: Scheme[]
  discardDrawn?: Scheme[]
  privelegeTaken?: Scheme[]
}): DrawData {
  if (deck.length === 0) {
    if (discard.length === 0) {
      const privelege = guardScheme({ rank: 1 })
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
