import { Scheme } from '../types'
import reduceLowestTime from '../reduce/lowestTime'
import getSchemes from './schemes'

export default function getLowestTimeScheme (refs: Scheme[]): Scheme | undefined {
  if (refs.length === 0) return undefined
  const schems = getSchemes(refs)
  const lowestTimeScheme = reduceLowestTime(schems)
  return lowestTimeScheme
}
