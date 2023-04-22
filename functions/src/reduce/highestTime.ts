import { Scheme } from '../types'

export default function reduceHighestTime (schemes: Scheme[]): Scheme {
  const lowestTimeScheme = schemes.reduce((highest, scheme) => {
    if (scheme.time > highest.time) return scheme
    return highest
  })
  return lowestTimeScheme
}
