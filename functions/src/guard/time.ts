import { times } from '../db'
import guardDefined from './defined'

export default function guardTime (rank: number): number {
  const time = times[rank]
  const label = `Invalid time rank: ${rank}`
  return guardDefined(time, label)
}
