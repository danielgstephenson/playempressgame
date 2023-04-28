import createEvent from '../create/event'
import getHighestRankScheme from '../get/highestRankScheme'
import serializeScheme from '../serialize/scheme'
import { HighsGuard, Player, Result } from '../types'
import guardPlaySchemes from './playSchemes'

export default function guardHighs (allPlayers: Array<Result<Player>>): HighsGuard {
  const playSchemes = guardPlaySchemes(allPlayers)
  const high = getHighestRankScheme(playSchemes)
  if (high == null) {
    throw new Error('No highest rank scheme.')
  }
  const highRank = String(high?.rank)
  const highEvent = createEvent(`The highest rank scheme in play is ${highRank}.`)
  const highs = playSchemes.filter(scheme => scheme.rank === high?.rank)
  const highRef = serializeScheme(high)
  const highRefs = highs.map(scheme => serializeScheme(scheme))
  return {
    high,
    highEvent,
    highRank,
    highRef,
    highRefs,
    highs
  }
}
