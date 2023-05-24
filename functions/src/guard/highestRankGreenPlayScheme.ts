import { Player, Result, Scheme } from '../types'
import getHighestRankScheme from '../get/highestRankScheme'
import isGreen from '../is/green'
import guardPlaySchemes from './playSchemes'

export default function guardHighestRankYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlaySchemes(players)
  const yellowSchemes = playSchemes.filter(isGreen)
  const scheme = getHighestRankScheme(yellowSchemes)
  return scheme
}
