import { Scheme } from '../types'

export default function getBid ({
  tableau,
  bid
}: {
  tableau: Scheme[]
  bid: number
}): string | number {
  const ten = tableau.some(scheme => scheme.rank === 10) && bid >= 10
  const bidStatus = ten ? `${bid - 10} + 10` : bid
  return bidStatus
}
