import createEvent from './create/event'
import { PlayState, Player, Result } from './types'
import passTime from './passTime'
import playEffects from './effects/play'
import guardDefined from './guard/defined'
import playerSort from './sort/player'
import filterIds from './filterIds'
import clone from './clone'
import { Transaction } from 'firelord'
import setPlayState from './setPlayState'
import endThreats from './endThreats'

export default function playLastReady ({
  playState,
  currentPlayer,
  transaction
}: {
  playState: PlayState
  currentPlayer: Result<Player>
  transaction: Transaction
}): void {
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready.`)
  const privateReadyEvent = createEvent('You are ready.')
  const everyoneEvent = createEvent('Everyone is ready.')
  playState.players.forEach(player => {
    if (player.id !== currentPlayer.id) {
      player.history.push(publicReadyEvent, everyoneEvent)
      return
    }
    player.history.push(privateReadyEvent, everyoneEvent)
  })
  playState.game.history.push(publicReadyEvent, everyoneEvent)
  playState.game.profiles.forEach(profile => {
    profile.trashHistory.push({ round: playState.game.round })
  })
  passTime({ playState })
  playState.players.forEach(player => {
    player.hand = player.hand.filter(scheme => scheme.id !== player.trashScheme?.id && scheme.id !== player.playScheme?.id)
    const trashScheme = guardDefined(player.trashScheme, 'Trash scheme')
    player.trashHistory.push({ scheme: trashScheme, round: playState.game.round })
    player.trashScheme = undefined
  })
  const playStateClone = clone(playState)
  playState.players.forEach((player) => {
    playEffects({
      playState,
      playingId: player.id,
      resume: false
    })
  })
  playState.players.forEach(player => {
    const roundIndex = player.history.findIndex(event => event.round === playState.game.round)
    const roundSlice = player.history.splice(roundIndex)
    const sorted = playerSort({ events: roundSlice, playerId: player.id })
    player.history.push(...sorted)
  })
  const effectsChoices = filterIds(playState.game.choices, playStateClone.game.choices)
  console.log('effectsChoices.length', effectsChoices.length)
  if (effectsChoices.length === 0) {
    endThreats({
      playState,
      transaction
    })
  } else {
    console.log('playLastReady setPlayState players', playState.players)
    console.log('playLastReady setPlayState currentplayer', currentPlayer)
    setPlayState({
      playState,
      transaction
    })
  }
}
