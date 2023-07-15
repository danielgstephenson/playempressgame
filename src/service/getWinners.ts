import { Profile } from '../types'
import getScore from './getScore'
import guardFirst from './guardFirst'

export default function getWinners ({
  profiles
}: {
  profiles: Profile[]
}): Profile[] {
  return profiles.reduce<Profile[]>((winners, profile) => {
    if (winners.length === 0) {
      return [profile]
    }
    const winner = guardFirst(winners, 'Winner')
    const winnerScore = getScore(winner)
    const score = getScore(profile)
    if (score === winnerScore) {
      const tiers: Profile[] = [...winners, profile]
      const handHighest = tiers.reduce((highest, tier) => {
        if (tier.hand == null) {
          return 0
        }
        const highestScheme = tier.hand.reduce((highestScheme, scheme) => {
          return scheme.rank > highestScheme.rank ? scheme : highestScheme
        })
        if (highestScheme.rank > highest) {
          return highestScheme.rank
        }
        return highest
      }, 0)
      const highTiers = tiers.filter(tier => {
        if (tier.hand == null) {
          return false
        }
        const highestScheme = tier.hand.reduce((highestScheme, scheme) => {
          return scheme.rank > highestScheme.rank ? scheme : highestScheme
        })
        return highestScheme.rank === handHighest
      })
      return highTiers
    }
    if (score > winnerScore) {
      return [profile]
    }
    return winners
  }, [])
}
