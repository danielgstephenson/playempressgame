import { Player, Result } from '../types'
import getTyingPlayers from './tyingPlayers'

export default function getHighestUntiedPlayer (
  players: Array<Result<Player>>
): Result<Player> | undefined {
  const highest = players
    .reduce<Result<Player> | undefined>((highest, player) => {
    if (player.withdrawn) {
      return highest
    }
    if (highest != null && highest.bid > player.bid) {
      const highestTiers = getTyingPlayers({ players, bid: highest.bid })
      if (highestTiers.length === 1) {
        return highest
      }
    }
    const profileTiers = getTyingPlayers({ players, bid: player.bid })
    if (profileTiers.length === 1) {
      return player
    }
    return undefined
  }, undefined)
  return highest
}
