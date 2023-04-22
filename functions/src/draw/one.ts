import guardScheme from '../guard/scheme'
import { DrawData, Scheme } from '../types'

export default function drawOne ({
  deck,
  discard,
  flipped = false,
  hand,
  deckDrawn = [],
  discardDrawn = [],
  privilegeTaken = []
}: {
  deck: Scheme[]
  discard: Scheme[]
  flipped?: boolean
  hand: Scheme[]
  deckDrawn?: Scheme[]
  discardDrawn?: Scheme[]
  privilegeTaken?: Scheme[]
}): DrawData {
  if (deck.length === 0) {
    if (discard.length === 0) {
      const privilege = guardScheme({ rank: 1 })
      return {
        deckDrawn,
        discardDrawn,
        flipped,
        privilegeTaken: [...privilegeTaken, privilege],
        drawnDeck: [],
        drawnDiscard: [],
        drawnHand: [...hand, privilege]
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
      privilegeTaken
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
    privilegeTaken
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
