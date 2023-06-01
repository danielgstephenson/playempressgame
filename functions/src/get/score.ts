import { Result, Player } from '../types'

export default function getScore (player: Result<Player>): number {
  const handScore = player.hand.reduce((score, scheme) => {
    return score + scheme.rank
  }, 0)
  const moneyScore = player.gold + player.silver
  const score = handScore + moneyScore
  return score
}
