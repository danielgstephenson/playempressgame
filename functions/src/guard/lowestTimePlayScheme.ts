import guardDefined from './defined'
import { Player, Result, Scheme } from '../types'
import getLowestTimeScheme from '../get/lowestTimeScheme'
import guardPlaySchemes from './playSchemes'

export default function guardLowestTimePlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlaySchemes(players)
  const scheme = getLowestTimeScheme(playSchemes)
  const defined = guardDefined(scheme, 'Lowest time scheme')
  return defined
}
