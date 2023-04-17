import { SchemeData } from '../types'

export default function reduceHighestTime (schemes: SchemeData[]): SchemeData {
  const lowestTimeScheme = schemes.reduce((highest, scheme) => {
    if (scheme.time > highest.time) return scheme
    return highest
  })
  return lowestTimeScheme
}
