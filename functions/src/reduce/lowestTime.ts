import { SchemeData } from '../types'

export default function reduceLowestTime (schemes: SchemeData[]): SchemeData {
  const lowestTimeScheme = schemes.reduce((lowest, scheme) => {
    if (scheme.time < lowest.time) return scheme
    return lowest
  })
  return lowestTimeScheme
}
