import { Scheme } from '../types'

export default function getLowestRankScheme (schemes: Scheme[]): Scheme | undefined {
  if (schemes.length === 0) return undefined
  const lowestRankScheme = schemes.reduce((lowest, scheme) => {
    if (scheme.rank < lowest.rank) return scheme
    return lowest
  })
  return lowestRankScheme
}
