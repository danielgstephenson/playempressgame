import { Player, Result, Scheme } from '../types'
import isGreenOrYellow from '../is/greenOrYellow'
import guardPlaySchemes from './playSchemes'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function guardLowestRankGreenOrYellowPlayScheme (players: Array<Result<Player>>): Scheme | undefined {
  const playSchemes = guardPlaySchemes(players)
  const greenOrYellowSchemes = playSchemes
    .filter(isGreenOrYellow)
  const scheme = getLowestRankScheme(greenOrYellowSchemes)
  return scheme
}
