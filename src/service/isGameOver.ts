import { Choice, Profile } from '../types'

export default function isGameOver ({
  profiles, final, choices
}: {
  profiles: Profile[]
  final: boolean
  choices: Choice[]
}): boolean {
  const allReady = profiles.every(profile => profile.playReady)
  return allReady && final && choices.length === 0
}
