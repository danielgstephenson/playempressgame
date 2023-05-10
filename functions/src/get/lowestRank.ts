import guardDefined from '../guard/defined'
import { Scheme } from '../types'
import getLowestRankScheme from './lowestRankScheme'

export default function getLowestTime (schemes: Scheme[]): number {
  const scheme = getLowestRankScheme(schemes)
  const rank = guardDefined(scheme, 'Lowest rank scheme').rank
  return rank
}
