import guardDefined from '../guard/defined'
import guardSchemeData from '../guard/schemeData'
import { SchemeData, SchemeRef } from '../types'

export default function getTop (schemes: SchemeRef[] | SchemeData[]): SchemeData | undefined {
  if (schemes.length === 0) {
    return undefined
  }
  const topSlice = schemes.slice(-1)
  const topScheme = guardDefined(topSlice[0], 'Top scheme')
  const topData = guardSchemeData(topScheme.rank)
  return topData
}
