import { Profile } from '../types'

export default function getTyingProfiles ({
  bid,
  profiles
}: {
  bid: number
  profiles?: Profile[]
}): Profile[] | undefined {
  return profiles?.filter(profile => !profile.withdrawn && profile.bid === bid)
}
