import { DrawResult, Scheme } from '../types'
import draw from '.'

export default function drawMultiple ({
  depth,
  discard,
  drawList,
  deck
}: {
  depth: number
  discard: Scheme[]
  drawList: Scheme[]
  deck: Scheme[]
}): DrawResult {
  if (depth === 0) {
    return {
      drawnList: drawList,
      drawnDeck: deck,
      drawnDiscard: discard
    }
  }
  const { drawnList, drawnDeck, drawnDiscard } = draw({ drawList, deck, discard })
  return drawMultiple({
    depth: depth - 1, drawList: drawnList, deck: drawnDeck, discard: drawnDiscard
  })
}
