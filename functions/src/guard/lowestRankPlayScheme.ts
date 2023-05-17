import guardPlayHandSchemes from './playHandSchemes'
import { Player, Result, Scheme } from '../types'
import guardLowestRankScheme from './lowestRankScheme'

export default function guardLowestRankPlayScheme (players: Array<Result<Player>>): Scheme {
  const playSchemes = guardPlayHandSchemes(players)
  const scheme = guardLowestRankScheme(playSchemes)
  return scheme
}
