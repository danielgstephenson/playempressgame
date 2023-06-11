import { Game, Profile, Result } from '../types'
import getTiers from './tiers'

export default function getHighestUntiedProfile (
  game: Result<Game>
): Profile | undefined {
  const highest = game
    .profiles
    .reduce<Profile | undefined>((highest, profile) => {
    if (profile.withdrawn) {
      return highest
    }
    if (highest != null && highest.bid > profile.bid) {
      const highestTiers = getTiers({ game, bid: highest.bid })
      if (highestTiers.length === 1) {
        return highest
      }
    }
    const profileTiers = getTiers({ game, bid: profile.bid })
    if (profileTiers.length === 1) {
      return profile
    }
    return undefined
  }, undefined)
  return highest
}
