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
  if (player.reserve.length === 0) {
    if (drawState.privilegeTaken.length === 0) {
      drawState.beforePrivilegeHand = [...player.hand]
    }
    const privilege = createScheme(1)
    drawState.privilegeTaken.push(privilege)
    drawState.allDrawn.push(privilege)
    player.hand.unshift(privilege)
    return drawState
  }
  const shiftScheme = player.reserve.shift()
  const topScheme = guardDefined(shiftScheme, 'Draw one top scheme')
  player.hand.push(topScheme)
  drawState.allDrawn.push(topScheme)
  drawState.drawnHand = [...player.hand]
  drawState.drawnReserve = [...player.reserve]
  drawState.drawn.unshift(topScheme)
  return drawState
}
