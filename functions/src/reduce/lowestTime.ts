import { Scheme } from '../types'

export default function reduceLowestTime (schemes: Scheme[]): Scheme {
  const lowestTimeScheme = schemes.reduce((lowest, scheme) => {
    if (scheme.time < lowest.time) return scheme
    return lowest
  })
  return lowestTimeScheme
}
