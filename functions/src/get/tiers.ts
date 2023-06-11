import { Result, Game, Profile } from '../types'

export default function getTiers ({
  bid,
  game
}: {
  bid: number
  game: Result<Game>
}): Profile[] {
  return game
    .profiles
    .filter(profile => !profile.withdrawn && profile.bid === bid)
}
