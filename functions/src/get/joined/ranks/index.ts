import { Scheme } from '../../../types'
import getJoined from '..'

export default function getJoinedRanks (schemes: Scheme[], empty: string = 'empty'): string {
  if (schemes.length === 0) {
    return empty
  }
  const ranks = schemes.map(scheme => scheme.rank)
  return getJoined(ranks)
}
