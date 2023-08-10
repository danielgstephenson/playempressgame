import { Profile } from '../types'

export default function isAgainstImprison ({ profiles, userId }: {
  profiles: Profile[]
  userId: string
}): boolean {
  const imprisoner = profiles.some(profile => profile.userId !== userId && profile.auctionReady)
  return imprisoner
}
