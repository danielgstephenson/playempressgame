import { Player, Result, Scheme } from '../types'
import isYellow from '../is/yellow'
import getLowestRankScheme from '../get/lowestRankScheme'
import guardPlaySchemes from './playSchemes'

export default function guardLowestRankYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlaySchemes(players)
  const yellowSchemes = playSchemes.filter(isYellow)
  const scheme = getLowestRankScheme(yellowSchemes)
  return scheme
}
