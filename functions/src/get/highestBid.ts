import { Result, Player, Profile } from '../types'

export default function getHighestBid (players: Array<Result<Player>> | Profile[]): number {
  const bids = players.map(player => player.withdrawn ? 0 : player.bid)
  const highestBid = bids.reduce((highest, bid) => {
    if (bid > highest) {
      return bid
    }
    return highest
  }, 0)
  return highestBid
}
