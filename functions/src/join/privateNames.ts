import join from '.'
import { Result, Player } from '../types'

export default function joinPrivateNames ({
  name = 'You',
  players,
  userId
}: {
  name?: string
  players: Array<Result<Player>>
  userId: string
}): string {
  const others = players.filter(otherPlayer => otherPlayer.userId !== userId)
  const otherNames = others.map(otherPlayer => otherPlayer.displayName)
  const names = [name, ...otherNames]
  const joined = join(names)
  return joined
}
