import { Player, Result } from '../types'
import guardLowestTimePlayScheme from './lowestTimePlayScheme'

export default function guardLowestPlayTime (players: Array<Result<Player>>): number {
  const lowestTimeScheme = guardLowestTimePlayScheme(players)
  return lowestTimeScheme.time
}
