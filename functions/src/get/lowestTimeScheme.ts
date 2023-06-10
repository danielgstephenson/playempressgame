import { Scheme } from '../types'
import reduceLowestTime from '../reduce/lowestTime'

export default function getLowestTimeScheme (schemes: Scheme[]): Scheme | undefined {
  if (schemes.length === 0) return undefined
  const lowestTimeScheme = reduceLowestTime(schemes)
  return lowestTimeScheme
}
