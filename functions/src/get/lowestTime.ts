import guardDefined from '../guard/defined'
import { SchemeRef } from '../types'
import getLowestTimeScheme from './lowestTimeScheme'

export default function getLowestTime (schemes: SchemeRef[]): number {
  const lowestTimeScheme = getLowestTimeScheme(schemes)
  const lowestTime = guardDefined(lowestTimeScheme, 'Lowest time scheme').time
  return lowestTime
}
