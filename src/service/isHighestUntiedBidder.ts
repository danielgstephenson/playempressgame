import { Profile } from '../types'
import getHighestUntiedProfile from './getHighestUntiedProfile'

export default function isHighestUntiedBidder ({
  profiles,
  userId
}: {
  profiles?: Profile[]
  userId?: string
}): boolean {
  const profile = getHighestUntiedProfile(profiles)
  if (profile == null) {
    return false
  }
  return profile.userId === userId
}
