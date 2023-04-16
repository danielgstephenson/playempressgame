import { Player } from '../types'
import getAllTimes from './allTimes'

export default function getHighestTime (allPlayers: Array<Player['read']>): number {
  const allTimes = getAllTimes(allPlayers)
  return Math.max(...allTimes)
}
