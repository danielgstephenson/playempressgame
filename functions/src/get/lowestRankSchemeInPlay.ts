import guardHandScheme from '../guard/handScheme'
import guardSchemeData from '../guard/schemeData'
import { Player, SchemeData } from '../types'

export default function getLowestRankSchemeInPlay (allPlayers: Array<Player['read']>): SchemeData {
  const lowestRank = allPlayers.reduce((lowest, player) => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    if (playScheme.rank < lowest) return playScheme.rank
    return lowest
  }, Infinity)
  const schemeData = guardSchemeData(lowestRank)
  return schemeData
}
