import guardDefined from '../guard/defined'
import { SchemeRef } from '../types'
import getLowestRankScheme from './lowestRankScheme'

export default function getLowestTime (schemes: SchemeRef[]): number {
  const scheme = getLowestRankScheme(schemes)
  const rank = guardDefined(scheme, 'Lowest rank scheme').rank
  return rank
}
