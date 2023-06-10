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
import summonOrImprison from './summonOrImprison'
import addChoiceEvents from './add/events/choice'

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
      player.events.push(publicReadyEvent, everyoneEvent)
      return
    }
    player.events.push(privateReadyEvent, everyoneEvent)
  })
  playState.game.events.push(publicReadyEvent, everyoneEvent)
  playState.game.profiles.forEach(profile => {
    profile.trashHistory.push({ round: playState.game.round })
  })
  passTime({ playState })
  playState.players.forEach(player => {
    player.hand = player
      .hand
      .filter(scheme => scheme.id !== player.trashScheme?.id && scheme.id !== player.playScheme?.id)
    const trashScheme = guardDefined(player.trashScheme, 'Trash scheme')
    player.trashHistory.push({ scheme: trashScheme, round: playState.game.round })
  })
  const playStateClone = clone(playState)
  console.log('playState.players', playState.players)
  playState.players.forEach((player) => {
    playEffects({
      playState,
      playingId: player.id,
      resume: false
    })
  })
  playState.players.forEach(player => {
    const roundIndex = player.events.findIndex(event => event.round === playState.game.round)
    const roundSlice = player.events.splice(roundIndex)
    const sorted = playerSort({ events: roundSlice, playerId: player.id })
    player.events.push(...sorted)
  })
  const effectsChoices = filterIds(playState.game.choices, playStateClone.game.choices)
  if (effectsChoices.length === 0) {
    summonOrImprison({
      playState,
      transaction
    })
  } else {
    addChoiceEvents(playState)
    setPlayState({
      playState,
      transaction
    })
  }
}
