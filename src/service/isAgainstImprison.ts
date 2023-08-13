import { Profile } from '../types'
import isTied from './isTied'

export default function isAgainstImprison ({ profiles, userId }: {
  profiles: Profile[]
  userId: string
}): boolean {
  const imprisoner = profiles.some(profile => {
    if (profile.userId === userId) return false
    if (!profile.auctionReady) return false
    const tied = isTied({ profiles, bid: profile.bid })
    return tied
  })
  return imprisoner
}
