import guardDefined from '../guard/defined'
import { Scheme } from '../types'
import getLowestTimeScheme from './lowestTimeScheme'

export default function getLowestTime (schemes: Scheme[]): number {
  const lowestTimeScheme = getLowestTimeScheme(schemes)
  const lowestTime = guardDefined(lowestTimeScheme, 'Lowest time scheme').time
  return lowestTime
}
