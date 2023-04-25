import guardHandScheme from './handScheme'
import { Player, Result, Scheme } from '../types'

export default function guardPlayHandSchemes (players: Array<Result<Player>>): Scheme[] {
  const playSchemes = players.map(player => {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playScheme?.id, label: 'Hand play scheme'
    })
    return playScheme
  })
  return playSchemes
}
