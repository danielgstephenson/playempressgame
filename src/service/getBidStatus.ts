import { Scheme } from '../types'

export default function getBidStatus ({
  bid,
  debug = false,
  tableau
}: {
  bid: number
  debug?: boolean
  tableau: Scheme[]
}): string | number {
  const tenInPlay = tableau.some(scheme => scheme.rank === 10)
  if (debug) {
    console.log('tenInPlay', tenInPlay)
  }
  const ten = tenInPlay && bid >= 10
  if (debug) {
    console.log('ten', ten)
  }
  const bidStatus = ten ? `${bid - 10} + 10` : bid
  return bidStatus
}
