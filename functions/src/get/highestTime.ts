import guardDefined from '../guard/defined'
import { Scheme } from '../types'
import getHighestTimeScheme from './highestTimeScheme'

export default function getHighestTime (schemes: Scheme[]): number {
  const scheme = getHighestTimeScheme(schemes)
  const time = guardDefined(scheme, 'Highest time scheme').time
  return time
}
