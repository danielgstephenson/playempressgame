import { Player, Result, Scheme } from '../types'
import isYellow from '../is/yellow'
import getHighestRankScheme from '../get/highestRankScheme'
import guardPlaySchemes from './playSchemes'

export default function guardHighestRankYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlaySchemes(players)
  const yellowSchemes = playSchemes.filter(isYellow)
  const scheme = getHighestRankScheme(yellowSchemes)
  return scheme
}
