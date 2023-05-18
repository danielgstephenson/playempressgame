import createEvent from '../create/event'
import { PlayState, Player, Result } from '../types'
import passTimeState from './passTime'
import playEffects from './effects/play'
import guardDefined from '../guard/defined'
import playerSort from '../sort/player'

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
    profile.trashHistory.push(1)
  })
  playState.players.forEach(player => {
    player.hand = player.hand.filter(scheme => scheme.id !== player.trashScheme?.id)
    const trashScheme = guardDefined(player.trashScheme, 'Trash scheme')
    player.trashHistory.push({ scheme: trashScheme, round: playState.game.round })
    player.trashScheme = undefined
  })
  const passedState = passTimeState({ playState })
  const effectedState = passedState.players.reduce((playedState, player) => {
    const effectedState = playEffects({
      playState: playedState,
      playingId: player.id
    })
    return effectedState
  }, passedState)
  effectedState.players.forEach(player => {
    const roundIndex = player.history.findIndex(event => event.round === effectedState.game.round)
    const roundSlice = player.history.splice(roundIndex)
    const sorted = playerSort({ events: roundSlice, playerId: player.id })
    player.history.push(...sorted)
  })
  return effectedState
}
