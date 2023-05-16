import { PlayState, Player, Result } from '../../types'
import reviveOne from './one'

export default function reviveMultiple ({
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
  const revivedState = reviveOne({ playState, player })
  return reviveMultiple({
    depth: depth - 1,
    playState: revivedState,
    player
  })
}
