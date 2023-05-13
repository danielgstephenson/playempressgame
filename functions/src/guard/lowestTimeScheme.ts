import guardDefined from './defined'
import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import getLowestTimeScheme from '../get/lowestTimeScheme'

export default function guardLowestTimeScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlayHandSchemes(players)
  const lowestTimeScheme = getLowestTimeScheme(playSchemes)
  const scheme = guardDefined(lowestTimeScheme, 'Lowest time scheme')
  return scheme
}
