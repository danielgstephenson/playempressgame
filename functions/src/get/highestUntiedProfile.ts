import { Game, Profile, Result } from '../types'
import getTyingProfiles from './tyingProfiles'

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
      const highestTiers = getTyingProfiles({ game, bid: highest.bid })
      if (highestTiers.length === 1) {
        return highest
      }
    }
    const profileTiers = getTyingProfiles({ game, bid: profile.bid })
    if (profileTiers.length === 1) {
      return profile
    }
    return undefined
  }, undefined)
  return highest
}
