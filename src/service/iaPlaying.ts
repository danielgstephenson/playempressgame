import { Profile } from '../types'

export default function isPlaying ({ profiles, userId }: {
  profiles?: Profile[]
  userId?: string
}): boolean {
  const playing = profiles?.some(profile => profile.userId === userId)
  return playing === true
}
