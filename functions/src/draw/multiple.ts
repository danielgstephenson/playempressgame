import { DrawRefs, SchemeRef } from '../types'
import drawOne from './one'

export default function drawMultiple ({
  depth,
  discard,
  hand,
  deck
}: {
  depth: number
  discard: SchemeRef[]
  hand: SchemeRef[]
  deck: SchemeRef[]
}): DrawRefs {
  if (depth === 0) {
    return {
      drawnHand: hand,
      drawnDeck: deck,
      drawnDiscard: discard
    }
  }
  const { drawnHand, drawnDeck, drawnDiscard } = drawOne({ hand, deck, discard })
  return drawMultiple({
    depth: depth - 1, hand: drawnHand, deck: drawnDeck, discard: drawnDiscard
  })
}
