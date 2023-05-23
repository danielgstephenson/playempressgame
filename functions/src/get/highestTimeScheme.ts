import { Scheme } from '../types'
import getSchemes from './schemes'
import reduceHighestTime from '../reduce/highestTime'

export default function getHighestTimeScheme (refs: Scheme[]): Scheme | undefined {
  if (refs.length === 0) return undefined
  const schemes = getSchemes(refs)
  const highestTimeScheme = reduceHighestTime(schemes)
  return highestTimeScheme
}
