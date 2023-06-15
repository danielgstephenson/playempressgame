import profileToPlayer from './profileToPlayer'
import { Game, PlayerState, Result } from './types'
import guardDefined from './guard/defined'

export default function gameToPlayerState ({
  currentUid,
  game
}: {
  currentUid: string
  game: Result<Game>
}): PlayerState {
  const players = game.profiles.map(profile => {
    const player = profileToPlayer(profile)
    return player
  })
  const found = players.find(player => player.userId === currentUid)
  const profilePlayer = guardDefined(found, 'Profile player')
  const playState = {
    game,
    players
  }
  return {
    currentPlayer: profilePlayer,
    playState
  }
}
