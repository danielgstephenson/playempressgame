export default function getBid ({
  newBid,
  gold,
  oldBid,
  silver
}: {
  newBid: number
  gold: number
  oldBid?: number
  silver: number
}): number {
  const silverBid = newBid % 5 !== 0
  if (silverBid) {
    const silverNeeded = newBid % 5
    if (silver < silverNeeded) {
      const fiveFactor = Math.floor(newBid / 5)
      const goldBid = fiveFactor * 5
      if (oldBid == null || newBid > oldBid) {
        const higherbid = goldBid + 5
        if (gold >= higherbid) {
          return higherbid
        }
        const maximumBid = goldBid + silver
        return maximumBid
      } else {
        const maximumBid = goldBid + silver
        return maximumBid
      }
    }
  }
  return newBid
}
