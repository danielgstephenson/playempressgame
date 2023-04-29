import { Player, Result, Scheme } from '../types'
import guardPlayScheme from './playScheme'

export default function guardPlaySchemes (players: Array<Result<Player>>): Scheme[] {
  const playSchemes = players.map(player => {
    return guardPlayScheme(player)
  })
  return playSchemes
}
