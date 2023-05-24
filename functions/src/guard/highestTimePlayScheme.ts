import guardDefined from './defined'
import { Player, Result, Scheme } from '../types'
import getHighestTimeScheme from '../get/highestTimeScheme'
import guardPlaySchemes from './playSchemes'

export default function guardHighestTimePlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlaySchemes(players)
  const highestTimeScheme = getHighestTimeScheme(playSchemes)
  const scheme = guardDefined(highestTimeScheme, 'Highest time scheme')
  return scheme
}
