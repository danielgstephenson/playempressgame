import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import getHighestRankScheme from '../get/highestRankScheme'
import isGreenOrYellow from '../is/greenOrYellow'

export default function guardHighestRankGreenOrYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlayHandSchemes(players)
  const yellowSchemes = playSchemes.filter(isGreenOrYellow)
  const scheme = getHighestRankScheme(yellowSchemes)
  return scheme
}
