import guardDefined from '../guard/defined'
import { PlayState, Player, Result } from '../types'

export default function reviveOne ({
  playState,
  player
}: {
  playState: PlayState
  player: Result<Player>
}): PlayState {
  if (player.discard.length === 0) {
    return playState
  }
  const popScheme = player.discard.pop()
  const topScheme = guardDefined(popScheme, 'Revive one top scheme')
  player.hand.push(topScheme)
  return playState
}
