import { Result, Player, Scheme } from './types'

export default function filterPlaySchemes (player: Result<Player>): Scheme[] {
  return player
    .hand
    .filter(scheme => scheme.id !== player.trashScheme?.id && scheme.id !== player.playScheme?.id)
}
