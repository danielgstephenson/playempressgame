import { SchemeRef } from '../types'

export default function getRanks (schemes: SchemeRef[]): string {
  if (schemes.length === 0) {
    return ''
  }
  const ranks = schemes.map(scheme => scheme.rank)
  if (ranks.length === 1) {
    return String(ranks[0])
  }
  if (ranks.length === 2) {
    return ranks.join(' and ')
  }
  const copy = [...ranks]
  const lastRank = String(copy.pop())
  const firstRanks = copy.join(', ')
  const joined = `${firstRanks}, and ${lastRank}`
  return joined
}
