import { Player, Result, Scheme } from '../types'
import guardHandScheme from './handScheme'

export default function guardPlayHandScheme (player: Result<Player>): Scheme {
  const playScheme = guardHandScheme({
    hand: player.hand, schemeId: player.playScheme?.id, label: 'Hand play scheme'
  })
  return playScheme
}
