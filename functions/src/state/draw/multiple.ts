import { PlayState, Player, Result } from '../../types'
import drawOneState from './one'

export default function drawMultipleState ({
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
  const drawnState = drawOneState({
    playState,
    player
  })
  return drawMultipleState({
    depth: depth - 1,
    playState: drawnState,
    player
  })
}
