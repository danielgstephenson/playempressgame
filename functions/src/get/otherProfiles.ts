import { Result, Game, Player, Profile } from '../types'

export default function getOtherProfiles ({
  currentGame,
  currentPlayer
}: {
  currentGame: Result<Game>
  currentPlayer: Result<Player>
}): Profile[] {
  return currentGame
    .profiles
    .filter(profile => profile.userId !== currentPlayer.userId)
}
