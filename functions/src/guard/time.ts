import { times } from '../db'

export default function guardTime (rank: number): number {
  const time = times[rank]
  if (time === undefined) {
    throw new Error(`Invalid time rank: ${rank}`)
  }
  return time
}
