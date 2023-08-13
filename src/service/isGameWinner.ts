import { Profile } from '../types'
import getWinners from './getWinners'

export default function isGameWinner ({
  profiles,
  userId
}: {
  profiles: Profile[]
  userId: string
}): boolean {
  const winners = getWinners({ profiles })
  const winner = winners.some(winner => winner.userId === userId)
  return winner
}
