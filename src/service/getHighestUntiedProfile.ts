import { Profile } from '../types'
import isTied from './isTied'

export default function getHighestUntiedProfile (
  profiles?: Profile[]
): Profile | undefined {
  const highest = profiles?.reduce<Profile | undefined>((highest, profile) => {
    if (profile.withdrawn) {
      return highest
    }
    if (highest != null && highest.bid > profile.bid) {
      const highestTied = isTied({ profiles, bid: highest.bid })
      if (!highestTied) {
        return highest
      }
    }
    const profileTied = isTied({ profiles, bid: profile.bid })
    if (!profileTied) {
      return profile
    }
    return undefined
  }, undefined)
  return highest
}
