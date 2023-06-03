import { Game, Profile, Result } from '../types'

export default function getHighestUntiedProfile (
  game: Result<Game>
): Profile | undefined {
  const highest = game
    .profiles
    .reduce<Profile | undefined>((highest, profile) => {
    console.log('highest', highest)
    console.log('profile', profile)
    if (highest != null && highest.bid > profile.bid) {
      const highestTiers = game
        .profiles
        .filter(profile => profile.bid === highest.bid)
      console.log('tiers.length', highestTiers.length)
      if (highestTiers.length === 1) {
        return highest
      }
    }
    const profileTiers = game
      .profiles
      .filter(p => profile.bid === p.bid)
    if (profileTiers.length === 1) {
      return profile
    }
    return undefined
  }, undefined)
  return highest
}