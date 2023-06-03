import { Result, Game } from '../types'

export default function isAuctionWaiting (game: Result<Game>): boolean {
  const readyProfiles = game.profiles.filter(profile => profile.auctionReady)
  const waiting = game.profiles.length - readyProfiles.length > 1
  return waiting
}
