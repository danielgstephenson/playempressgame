import { Profile } from '../types'
import getTyingProfiles from './getTyingProfiles'

export default function isTied ({
  profiles,
  bid
}: {
  profiles: Profile[]
  bid: number
}): boolean {
  const tyingProfiles = getTyingProfiles({
    profiles, bid
  })
  const tied = tyingProfiles != null && tyingProfiles.length > 1
  return tied
}
