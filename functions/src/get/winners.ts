import guardFirst from '../guard/first'
import { Player, Result } from '../types'
import getScore from './score'

export default function getWinners ({
  players
}: {
  players: Array<Result<Player>>
}): Array<Result<Player>> {
  return players.reduce<Array<Result<Player>>>((winners, player) => {
    if (winners.length === 0) {
      return [player]
    }
    const winner = guardFirst(winners, 'Winner')
    const winnerScore = getScore(winner)
    const score = getScore(player)
    if (score === winnerScore) {
      const tiers: Array<Result<Player>> = [...winners, player]
      const handHighest = tiers.reduce((highest, tier) => {
        const highestScheme = tier.hand.reduce((highestScheme, scheme) => {
          return scheme.rank > highestScheme.rank ? scheme : highestScheme
        })
        if (highestScheme.rank > highest) {
          return highestScheme.rank
        }
        return highest
      }, 0)
      const highTiers = tiers.filter(tier => {
        const highestScheme = tier.hand.reduce((highestScheme, scheme) => {
          return scheme.rank > highestScheme.rank ? scheme : highestScheme
        })
        return highestScheme.rank === handHighest
      })
      return highTiers
    }
    if (score > winnerScore) {
      return [player]
    }
    return winners
  }, [])
}
