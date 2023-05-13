import { Player, Result } from '../types'
import guardLowestTimeScheme from './lowestTimeScheme'

export default function guardLowestTime (players: Array<Result<Player>>): number {
  const lowestTimeScheme = guardLowestTimeScheme(players)
  return lowestTimeScheme.time
}
