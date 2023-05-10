import createEvent from '../create/event'
import { PlayState, Player, Result } from '../types'
import passTimeState from './passTime'
import playEffectState from './playEffect'

export default function playLastReadyState ({
  playState,
  currentPlayer
}: {
  playState: PlayState
  currentPlayer: Result<Player>
}): PlayState {
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready.`)
  const privateReadyEvent = createEvent('You are ready.')
  playState.players.forEach(player => {
    if (player.id !== currentPlayer.id) {
      player.history.push(publicReadyEvent)
      return
    }
    player.history.push(privateReadyEvent)
  })
  playState.game.history.push(publicReadyEvent)
  playState.game.profiles.forEach(profile => {
    profile.ready = false
  })
  const passedState = passTimeState({ playState })
  const playedState = passedState.players.reduce((playedState, player) => {
    const effectedState = playEffectState({
      playState: playedState,
      playingId: player.id
    })
    return effectedState
  }, passedState)
  return playedState
}
