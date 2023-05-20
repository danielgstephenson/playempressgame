import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import isGreen from '../is/green'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function guardLowestRankGreenPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlayHandSchemes(players)
  const greenSchemes = playSchemes.filter(isGreen)
  const scheme = getLowestRankScheme(greenSchemes)
  return scheme
}
