import { Player, Result, Scheme } from '../types'
import guardDefined from './defined'
import getHighestRankScheme from '../get/highestRankScheme'
import guardPlaySchemes from './playSchemes'

export default function guardHighestRankPlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlaySchemes(players)
  const scheme = getHighestRankScheme(playSchemes)
  const defined = guardDefined(scheme, 'Highest rank play scheme')
  return defined
}
