import { Player, Result, Scheme } from '../types'
import guardPlayHandScheme from './playHandScheme'

export default function guardPlayHandSchemes (players: Array<Result<Player>>): Scheme[] {
  const playSchemes = players.map(player => {
    const playScheme = guardPlayHandScheme(player)
    return playScheme
  })
  return playSchemes
}
