import { PlayState, Profile } from '../types'
import guardDefined from './defined'

export default function guardProfile (
  playState: PlayState,
  userId: string
): Profile {
  const found = playState
    .game
    .profiles
    .find(profile => profile.userId === userId)
  const profile = guardDefined(found, 'Profile')
  return profile
}
