import guardDefined from '../guard/defined'
import { SchemeRef } from '../types'
import getHighestTimeScheme from './highestTimeScheme'

export default function getHighestTime (schemes: SchemeRef[]): number {
  const scheme = getHighestTimeScheme(schemes)
  const time = guardDefined(scheme, 'Highest time scheme').time
  return time
}
