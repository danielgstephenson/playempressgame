import { PlayState, Player, Result } from '../../types'
import reviveOneState from './one'

export default function reviveMultipleState ({
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
  const revivedState = reviveOneState({ playState, player })
  return reviveMultipleState({
    depth: depth - 1,
    playState: revivedState,
    player
  })
}
