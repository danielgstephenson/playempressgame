import { Player, Result } from '../types'
import guardHighestTimeScheme from './highestTimeScheme'

export default function guardHighestTime (players: Array<Result<Player>>): number {
  const scheme = guardHighestTimeScheme(players)
  return scheme.time
}
