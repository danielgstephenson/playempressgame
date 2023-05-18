import { Game, Result, Scheme } from '../types'
import isGreenOrYellow from '../is/greenOrYellow'
import getHighestRankScheme from '../get/highestRankScheme'

export default function guardHighestRankGreenOrYellowDungeonScheme (
  game: Result<Game>
): Scheme | undefined {
  const greenOrYellowSchemes = game
    .dungeon
    .filter(scheme => isGreenOrYellow(scheme))
  const scheme = getHighestRankScheme(greenOrYellowSchemes)
  return scheme
}
