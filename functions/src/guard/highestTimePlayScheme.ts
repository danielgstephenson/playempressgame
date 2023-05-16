import guardDefined from './defined'
import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import getHighestTimeScheme from '../get/highestTimeScheme'

export default function guardHighestTimePlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlayHandSchemes(players)
  const highestTimeScheme = getHighestTimeScheme(playSchemes)
  const scheme = guardDefined(highestTimeScheme, 'Highest time scheme')
  return scheme
}
