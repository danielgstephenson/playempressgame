import { Profile } from '../types'

export default function createProfile ({
  displayName,
  gameId,
  userId
}: {
  displayName: string
  gameId: string
  userId: string
}): Profile {
  const profile: Profile = {
    auctionReady: false,
    bid: 0,
    displayName,
    gameId,
    gold: 0,
    lastBidder: false,
    playReady: false,
    silver: 0,
    inPlay: [],
    reserveLength: 0,
    trashHistory: [],
    privateTrashHistory: [],
    userId,
    withdrawn: false
  }
  return profile
}
