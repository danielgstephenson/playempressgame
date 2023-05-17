import { Scheme } from '../types'
import getSchemes from './schemes'

export default function getHighestRankScheme (refs: Scheme[]): Scheme | undefined {
  if (refs.length === 0) return undefined
  const schemes = getSchemes(refs)
  const lowestRankScheme = schemes.reduce((lowest, scheme) => {
    if (scheme.rank > lowest.rank) return scheme
    return lowest
  })
  return lowestRankScheme
}
