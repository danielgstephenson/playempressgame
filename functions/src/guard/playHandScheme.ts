import { Player, Result, Scheme } from '../types'
import guardHandScheme from './handScheme'

export default function guardPlayHandScheme (player: Result<Player>): Scheme {
  try {
    const playScheme = guardHandScheme({
      hand: player.hand, schemeId: player.playScheme?.id, label: 'Hand play scheme'
    })
    return playScheme
  } catch (error) {
    console.error('guardPlayHandScheme error player', player)
    throw error
  }
}
