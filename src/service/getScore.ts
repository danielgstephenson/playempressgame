import { Player, Profile } from '../types'

export default function getScore (profile: Partial<Profile> | Partial<Player>): number {
  if (profile.hand == null || profile.gold == null || profile.silver == null) {
    return 0
    // throw new Error('Profile is not fully defined')
  }
  const handScore = profile.hand.reduce((score, scheme) => {
    return score + scheme.rank
  }, 0)
  const moneyScore = profile.gold + profile.silver
  const score = handScore + moneyScore
  return score
}
