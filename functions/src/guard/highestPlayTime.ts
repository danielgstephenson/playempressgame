import { Player, Result } from '../types'
import guardHighestTimePlayScheme from './highestTimePlayScheme'

export default function guardHighestPlayTime (players: Array<Result<Player>>): number {
  const scheme = guardHighestTimePlayScheme(players)
  return scheme.time
}
