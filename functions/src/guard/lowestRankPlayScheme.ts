import { Player, Result, Scheme } from '../types'
import guardDefined from './defined'
import getLowestRankScheme from '../get/lowestRankScheme'
import guardPlaySchemes from './playSchemes'

export default function guardLowestRankPlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlaySchemes(players)
  const scheme = getLowestRankScheme(playSchemes)
  const defined = guardDefined(scheme, 'Lowest rank play scheme')
  return defined
}
