import { Profile } from '../types'
import areAllReady from './areAllReady'
import isHighestUntiedBidder from './isHighestUntiedBidder'

export default function isTaking ({
  profiles,
  userId
}: {
  profiles?: Profile[]
  userId?: string
}): boolean {
  const allReady = areAllReady(profiles)
  const highestUntiedBidder = isHighestUntiedBidder({ profiles, userId })
  return allReady && highestUntiedBidder
}
