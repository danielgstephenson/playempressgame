import guardDefined from './defined'
import { Scheme } from '../types'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function guardLowestRankScheme (schemes: Scheme[]): Scheme {
  const scheme = getLowestRankScheme(schemes)
  const defined = guardDefined(scheme, 'Lowest rank scheme')
  return defined
}
