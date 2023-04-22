import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import { Player } from '../types'

export default function getAllTimes (allPlayers: Array<Player['read']>): number[] {
  return allPlayers.map(player => {
    const playScheme = guardHandScheme({
      hand: player.hand,
      schemeId: player.playScheme?.id,
      label: 'Play scheme'
    })
    const time = guardTime(playScheme.rank)
    return time
  })
}
