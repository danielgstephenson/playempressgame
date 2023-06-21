import { Result, Player, Scheme } from './types'

export default function filterPlaySchemes (player: Result<Player>): Scheme[] {
  if (player.trashScheme == null || player.playScheme == null) {
    throw new Error('Player is not ready.')
  }
  return player
    .hand
    .filter(scheme => scheme.id !== player.trashScheme?.id && scheme.id !== player.playScheme?.id)
}
