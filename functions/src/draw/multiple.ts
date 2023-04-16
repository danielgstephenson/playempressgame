import { DrawRefs, SchemeRef } from '../types'
import drawOne from './one'

export default function drawMultiple ({
  deck,
  deckDrawn = [],
  depth,
  discard,
  discardDrawn = [],
  flipped = false,
  hand,
  privelegeTaken = []
}: {
  deck: SchemeRef[]
  deckDrawn?: SchemeRef[]
  depth: number
  discard: SchemeRef[]
  flipped?: boolean
  discardDrawn?: SchemeRef[]
  hand: SchemeRef[]
  privelegeTaken?: SchemeRef[]
}): DrawRefs {
  if (depth === 0) {
    return {
      deckDrawn,
      discardDrawn,
      drawnHand: hand,
      drawnDeck: deck,
      drawnDiscard: discard,
      flipped,
      privelegeTaken
    }
  }
  const {
    deckDrawn: drawnDeckDrawn,
    discardDrawn: drawnDiscardDrawn,
    drawnHand,
    drawnDeck,
    drawnDiscard,
    flipped: drawnFlipped,
    privelegeTaken: drawnPrivelegeTaken
  } = drawOne({
    deck,
    deckDrawn,
    discard,
    discardDrawn,
    flipped,
    hand,
    privelegeTaken
  })
  return drawMultiple({
    deck: drawnDeck,
    deckDrawn: drawnDeckDrawn,
    depth: depth - 1,
    discard: drawnDiscard,
    discardDrawn: drawnDiscardDrawn,
    flipped: drawnFlipped,
    hand: drawnHand,
    privelegeTaken: drawnPrivelegeTaken
  })
}
