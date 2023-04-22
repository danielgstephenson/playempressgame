import { SchemeRef } from '../../types'
import getJoined from '.'

export default function getJoinedRanks (schemes: SchemeRef[]): string {
  const ranks = schemes.map(scheme => scheme.rank)
  return getJoined(ranks)
}
