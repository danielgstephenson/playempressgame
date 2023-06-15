import getHighestBid from '../get/highestBid'
import { Game, Player, Result } from '../types'

export default function isCarryingOutEleven ({ game, player }: {
  game: Result<Game>
  player: Result<Player>
}): boolean {
  const eleven = player.tableau.some(scheme => scheme.rank === 11)
  if (eleven) {
    const otherProfiles = game.profiles.filter(profile => profile.userId !== player.userId)
    const highestBid = getHighestBid(otherProfiles)
    if (highestBid > 5) {
      return true
    }
    return false
  }
  return false
}
