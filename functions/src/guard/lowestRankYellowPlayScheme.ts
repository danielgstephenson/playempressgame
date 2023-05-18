import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import isYellow from '../is/yellow'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function guardLowestRankYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlayHandSchemes(players)
  const yellowSchemes = playSchemes.filter(isYellow)
  const scheme = getLowestRankScheme(yellowSchemes)
  return scheme
}
