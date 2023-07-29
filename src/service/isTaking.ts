import { Choice, Profile } from '../types'
import areAllReady from './areAllReady'
import isHighestUntiedBidder from './isHighestUntiedBidder'

export default function isTaking ({
  profiles,
  userId,
  choices
}: {
  profiles?: Profile[]
  userId?: string
  choices?: Choice[]
}): boolean {
  const allReady = areAllReady(profiles)
  const highestUntiedBidder = allReady && isHighestUntiedBidder({ profiles, userId })
  const noChoice = highestUntiedBidder && choices != null && choices.length === 0
  return noChoice
}
