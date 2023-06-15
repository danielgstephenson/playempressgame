import { Result, Player } from '../types'

export default function getTyingPlayers ({
  bid,
  players
}: {
  bid: number
  players: Array<Result<Player>>
}): Array<Result<Player>> {
  return players.filter(player => !player.withdrawn && player.bid === bid)
}
