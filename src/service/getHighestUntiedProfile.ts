import { DocState } from '../lib/fireread/types'
import { Game, Profile } from '../types'
import getTyingProfiles from './getTyingProfiles'

export default function getHighestUntiedProfile (
  game: DocState<Game>
): Profile | undefined {
  const highest = game
    .profiles
    ?.reduce<Profile | undefined>((highest, profile) => {
    if (profile.withdrawn) {
      return highest
    }
    if (highest != null && highest.bid > profile.bid) {
      const highestTiers = getTyingProfiles({ game, bid: highest.bid })
      if (highestTiers == null || highestTiers.length === 1) {
        return highest
      }
    }
    const profileTiers = getTyingProfiles({ game, bid: profile.bid })
    if (profileTiers == null || profileTiers.length === 1) {
      return profile
    }
    return undefined
  }, undefined)
  return highest
}
