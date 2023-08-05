export default function getBid ({
  bid,
  gold,
  silver
}: {
  bid: number
  gold: number
  silver: number
}): number {
  const silverBid = bid % 5 !== 0
  if (silverBid) {
    const minimumSilver = bid % 5
    if (silver < minimumSilver) {
      const fiveFactor = Math.floor(bid / 5)
      const goldBid = fiveFactor * 5
      const higherbid = goldBid + 5
      if (gold >= higherbid) {
        return higherbid
      }
      const maximumBid = goldBid + silver
      return maximumBid
    }
  }
  return bid
}
