import profileToPlayer from './profileToPlayer'
import { Game, PlayerEvent, PlayerState, Result } from './types'
import guardDefined from './guard/defined'
import addEvent from './add/event'
import addPlayerEvent from './add/event/player'

export default function gameToPlayerState ({
  currentUid,
  game,
  privateMessage,
  publicMessage
}: {
  currentUid: string
  game: Result<Game>
  privateMessage: string
  publicMessage: string
}): PlayerState {
  const observerEvent = addEvent(game, publicMessage)
  const playerEvents: PlayerEvent[] = []
  const players = game.profiles.map(profile => {
    const player = profileToPlayer(profile)
    if (player.userId === currentUid) {
      const event = addPlayerEvent({
        container: player,
        message: privateMessage,
        round: game.round,
        playerId: player.id
      })
      playerEvents.push(event)
    } else {
      const event = addPlayerEvent({
        container: player,
        message: publicMessage,
        round: game.round,
        playerId: player.id
      })
      playerEvents.push(event)
    }
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
    observerEvent,
    playerEvents,
    playState
  }
}
