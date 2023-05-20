import { Scheme } from '../../../types'
import getJoined from '..'

export default function getJoinedRanks (schemes: Scheme[]): string {
  const ranks = schemes.map(scheme => scheme.rank)
  return getJoined(ranks)
}
