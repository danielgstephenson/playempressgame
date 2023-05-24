import { Player, Result, Scheme } from '../types'
import isGreen from '../is/green'
import getLowestRankScheme from '../get/lowestRankScheme'
import guardPlaySchemes from './playSchemes'

export default function guardLowestRankGreenPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlaySchemes(players)
  const greenSchemes = playSchemes.filter(isGreen)
  const scheme = getLowestRankScheme(greenSchemes)
  return scheme
}
