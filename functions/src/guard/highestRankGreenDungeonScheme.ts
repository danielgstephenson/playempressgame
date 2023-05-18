import { Game, Result, Scheme } from '../types'
import isGreen from '../is/green'
import getHighestRankScheme from '../get/highestRankScheme'

export default function guardHighestRankGreenDungeonScheme (
  game: Result<Game>
): Scheme | undefined {
  const greenSchemes = game
    .dungeon
    .filter(scheme => isGreen(scheme))
  const scheme = getHighestRankScheme(greenSchemes)
  return scheme
}
