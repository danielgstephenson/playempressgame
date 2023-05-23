import { Player, Result, Scheme } from '../types'
import guardDefined from './defined'

export default function guardPlayScheme (player: Result<Player>): Scheme {
  const scheme = guardDefined(player.playScheme, `${player.displayName}'s play scheme`)
  return scheme
}
