import { SchemeData, SchemeRef } from '../types'
import getSchemeData from './schemeData'

export default function getHighestRankScheme (schemes: SchemeRef[]): SchemeData | undefined {
  if (schemes.length === 0) return undefined
  const schemeData = getSchemeData(schemes)
  const lowestRankScheme = schemeData.reduce((lowest, scheme) => {
    if (scheme.rank > lowest.rank) return scheme
    return lowest
  })
  return lowestRankScheme
}
