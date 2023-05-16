import guardDefined from './defined'
import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function guardLowestRankPlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlayHandSchemes(players)
  const scheme = getLowestRankScheme(playSchemes)
  const defined = guardDefined(scheme, 'Lowest rank scheme')
  return defined
}
