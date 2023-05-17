import guardDefined from './defined'
import { Scheme } from '../types'
import getHighestRankScheme from '../get/highestRankScheme'

export default function guardHighestRankScheme (schemes: Scheme[]): Scheme {
  const scheme = getHighestRankScheme(schemes)
  const defined = guardDefined(scheme, 'Highest rank scheme')
  return defined
}
