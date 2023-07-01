import { Profile } from '../types'

export default function areAllReady (profiles?: Profile[]): boolean {
  const allReady = profiles?.every(profile => profile.auctionReady)
  return allReady === true
}
