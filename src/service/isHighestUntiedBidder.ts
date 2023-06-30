import { DocState } from '../lib/fireread/types'
import { Game } from '../types'
import getHighestUntiedProfile from './getHighestUntiedProfile'

export default function isHighestUntiedBidder ({
  game,
  userId
}: {
  game: DocState<Game>
  userId?: string
}): boolean {
  const profile = getHighestUntiedProfile(game)
  console.log('profile', profile)
  if (profile == null) {
    return false
  }
  return profile.userId === userId
}
