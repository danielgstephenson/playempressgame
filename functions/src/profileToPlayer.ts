import { Player, Profile, Result } from './types'

export default function profileToPlayer (profile: Profile): Result<Player> {
  const id = `${profile.userId}_${profile.gameId}`
  return {
    auctionReady: profile.auctionReady,
    bid: profile.bid,
    deck: [],
    discard: [],
    displayName: profile.displayName,
    events: [],
    gameId: profile.gameId,
    gold: profile.gold,
    hand: [],
    id,
    lastBidder: profile.lastBidder,
    playScheme: undefined,
    silver: profile.silver,
    tableau: profile.tableau,
    trashHistory: [],
    trashScheme: undefined,
    userId: profile.userId,
    withdrawn: profile.withdrawn,
    playReady: profile.playReady
  }
}
