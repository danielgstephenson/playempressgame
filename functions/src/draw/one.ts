import createScheme from '../create/scheme'
import guardDefined from '../guard/defined'
import { Player, Result, DrawState } from '../types'

export default function drawOne ({
  drawState,
  player
}: {
  drawState: DrawState
  player: Result<Player>
}): DrawState {
  if (player.deck.length === 0) {
    if (player.discard.length === 0) {
      if (drawState.privilegeTaken.length === 0) {
        drawState.beforePrivilegeHand = [...player.hand]
      }
      const privilege = createScheme(1)
      drawState.privilegeTaken.push(privilege)
      drawState.allDrawn.push(privilege)
      player.hand.push(privilege)
      return drawState
    }
    const copy = [...player.discard]
    const flippedDiscard = copy.reverse()
    drawState.discardFlipped = true
    player.deck = flippedDiscard
    drawState.flippedDeck = [...flippedDiscard]
    player.discard = []
    return drawOne({
      drawState,
      player
    })
  }
  const shiftScheme = player.deck.shift()
  const topScheme = guardDefined(shiftScheme, 'Draw one top scheme')
  player.hand.push(topScheme)
  drawState.allDrawn.push(topScheme)
  if (drawState.discardFlipped) {
    drawState.discardDrawn.push(topScheme)
    drawState.discardDrawnDeck = [...player.deck]
    drawState.discardDrawnHand = [...player.hand]
  } else {
    drawState.deckDrawnHand = [...player.hand]
    drawState.deckDrawnDeck = [...player.deck]
    drawState.deckDrawn.push(topScheme)
  }
  return drawState
}
