import guardDefined from '../guard/defined'
import guardProfile from '../guard/profile'
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
  const profile = guardProfile(playState, player.userId)
  const popScheme = player.discard.pop()
  const topScheme = guardDefined(popScheme, 'Revive one top scheme')
  player.hand.push(topScheme)
  const topDiscardScheme = player.discard[player.discard.length - 1]
  profile.topDiscardScheme = topDiscardScheme
  return playState
}
