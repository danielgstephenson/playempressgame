import { Game, Result, Scheme } from '../types'
import guardLowestRankScheme from './lowestRankScheme'
import isGreenOrYellow from '../is/greenOrYellow'

export default function guardLowestRankGreenOrYellowDungeonScheme (
  game: Result<Game>
): Scheme {
  const greenOrYellowSchemes = game
    .dungeon
    .filter(scheme => isGreenOrYellow(scheme))
  const scheme = guardLowestRankScheme(greenOrYellowSchemes)
  return scheme
}
