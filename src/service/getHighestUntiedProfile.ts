import { Profile } from '../types'
import getTyingProfiles from './getTyingProfiles'

export default function getHighestUntiedProfile (
  profiles?: Profile[]
): Profile | undefined {
  const highest = profiles?.reduce<Profile | undefined>((highest, profile) => {
    if (profile.withdrawn) {
      return highest
    }
    if (highest != null && highest.bid > profile.bid) {
      const highestTiers = getTyingProfiles({ profiles, bid: highest.bid })
      if (highestTiers == null || highestTiers.length === 1) {
        return highest
      }
    }
    const profileTiers = getTyingProfiles({ profiles, bid: profile.bid })
    if (profileTiers == null || profileTiers.length === 1) {
      return profile
    }
    return undefined
  }, undefined)
  return highest
}
