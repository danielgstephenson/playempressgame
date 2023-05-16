import { PlayState, Player, Result } from '../../types'
import drawOne from './one'

export default function drawMultiple ({
  depth,
  playState,
  player
}: {
  depth: number
  playState: PlayState
  player: Result<Player>
}): PlayState {
  if (depth === 0) {
    return playState
  }
  const drawnState = drawOne({
    playState,
    player
  })
  return drawMultiple({
    depth: depth - 1,
    playState: drawnState,
    player
  })
}
