import createEvent from '../create/event'
import { PlayState, Player, Result, SchemeRef } from '../types'

export default function playLastReadyState ({
  playState,
  currentPlayer
}: {
  playState: PlayState
  currentPlayer: Result<Player>
}): PlayState {
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready.`)
  const privateReadyEvent = createEvent('You are ready.')
  playState.players = playState.players.map(player => {
    if (player.id !== currentPlayer.id) {
      player.history.push(publicReadyEvent)
      return player
    }
    player.history.push(privateReadyEvent)
    return player
  })
  playState.profiles.find(profile => {
    if (profile.id !== currentPlayer.id) return false
    profile.trashEmpty = false
    profile.ready = false
    return true
  })
  playState.game.history.push(publicEvent)
  return playState
}
