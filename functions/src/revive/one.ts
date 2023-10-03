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
  if (player.reserve.length === 0) {
    return playState
  }
  const profile = guardProfile(playState, player.userId)
  const shiftScheme = player.reserve.pop()
  const topScheme = guardDefined(shiftScheme, 'Revive one last reserve')
  player.hand.unshift(topScheme)
  const lastReserve = player.reserve[player.reserve.length - 1]
  profile.lastReserve = lastReserve
  return playState
}
