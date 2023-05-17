import { Game, Result, Scheme } from '../types'
import isGreen from '../is/green'
import guardHighestRankScheme from './highestRankScheme'

export default function guardHighestRankGreenDungeonScheme (
  game: Result<Game>
): Scheme {
  const greenSchemes = game
    .dungeon
    .filter(scheme => isGreen(scheme))
  const scheme = guardHighestRankScheme(greenSchemes)
  return scheme
}
