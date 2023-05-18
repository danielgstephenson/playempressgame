import { Game, Result, Scheme } from '../types'
import isGreenOrYellow from '../is/greenOrYellow'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function guardLowestRankGreenOrYellowDungeonScheme (
  game: Result<Game>
): Scheme | undefined {
  const greenOrYellowSchemes = game
    .dungeon
    .filter(scheme => isGreenOrYellow(scheme))
  const scheme = getLowestRankScheme(greenOrYellowSchemes)
  return scheme
}
