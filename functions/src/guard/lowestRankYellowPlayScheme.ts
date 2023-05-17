import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import guardLowestRankScheme from './lowestRankScheme'
import isYellow from '../is/yellow'

export default function guardLowestRankYellowPlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlayHandSchemes(players)
  const yellowSchemes = playSchemes.filter(isYellow)
  const scheme = guardLowestRankScheme(yellowSchemes)
  return scheme
}
