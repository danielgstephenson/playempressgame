import { SchemeData, SchemeRef } from '../types'
import reduceLowestTime from '../reduce/lowestTime'
import getSchemeData from './schemeData'

export default function getLowestTimeScheme (schemes: SchemeRef[]): SchemeData | undefined {
  if (schemes.length === 0) return undefined
  const schemeData = getSchemeData(schemes)
  const lowestTimeScheme = reduceLowestTime(schemeData)
  return lowestTimeScheme
}
