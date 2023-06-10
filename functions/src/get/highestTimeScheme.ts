import { Scheme } from '../types'
import reduceHighestTime from '../reduce/highestTime'

export default function getHighestTimeScheme (schemes: Scheme[]): Scheme | undefined {
  if (schemes.length === 0) return undefined
  const highestTimeScheme = reduceHighestTime(schemes)
  return highestTimeScheme
}
