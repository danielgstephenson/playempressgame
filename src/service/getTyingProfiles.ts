import { DocState } from '../lib/fireread/types'
import { Game, Profile } from '../types'

export default function getTyingProfiles ({
  bid,
  game
}: {
  bid: number
  game: DocState<Game>
}): Profile[] | undefined {
  return game
    .profiles
    ?.filter(profile => !profile.withdrawn && profile.bid === bid)
}
