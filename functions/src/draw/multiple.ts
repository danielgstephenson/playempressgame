import { PlayState, Player, Result, DrawState } from '../types'
import drawOne from './one'

export default function drawMultiple ({
  depth,
  drawState,
  player
}: {
  depth: number
  drawState: DrawState
  player: Result<Player>
}): DrawState {
  if (depth === 0) {
    return drawState
  }
  const drawnState = drawOne({
    drawState,
    player
  })
  return drawMultiple({
    depth: depth - 1,
    drawState: drawnState,
    player
  })
}
