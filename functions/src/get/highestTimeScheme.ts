import { SchemeData, SchemeRef } from '../types'
import getSchemeData from './schemeData'
import reduceHighestTime from '../reduce/highestTime'

export default function getHighestTimeScheme (schemes: SchemeRef[]): SchemeData | undefined {
  if (schemes.length === 0) return undefined
  const schemeData = getSchemeData(schemes)
  const highestTimeScheme = reduceHighestTime(schemeData)
  return highestTimeScheme
}
