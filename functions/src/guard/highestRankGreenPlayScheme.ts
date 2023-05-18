import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import getHighestRankScheme from '../get/highestRankScheme'
import isGreen from '../is/green'

export default function guardHighestRankYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlayHandSchemes(players)
  const yellowSchemes = playSchemes.filter(isGreen)
  const scheme = getHighestRankScheme(yellowSchemes)
  return scheme
}
