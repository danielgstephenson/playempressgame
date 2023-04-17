import guardSchemeData from '../guard/schemeData'
import { SchemeData, SchemeRef } from '../types'

export default function getSchemeData (schemes: SchemeRef[]): SchemeData[] {
  const schemeData = schemes.map((scheme) => {
    const playScheme = guardSchemeData(scheme.rank)
    return playScheme
  })
  return schemeData
}
