import guardDefined from './defined'
import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import getLowestTimeScheme from '../get/lowestTimeScheme'

export default function guardLowestTimePlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlayHandSchemes(players)
  const scheme = getLowestTimeScheme(playSchemes)
  const defined = guardDefined(scheme, 'Lowest time scheme')
  return defined
}
