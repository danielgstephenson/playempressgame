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
  const profile = {
    auctionReady: false,
    bid: 0,
    deckEmpty: true,
    displayName,
    gameId,
    gold: 0,
    lastBidder: false,
    playAreaEmpty: true,
    playReady: false,
    silver: 0,
    tableau: [],
    trashAreaEmpty: true,
    trashHistory: [],
    privateTrashHistory: [],
    userId,
    withdrawn: false
  }
  return profile
}
