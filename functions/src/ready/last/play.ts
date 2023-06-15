import createEvent from '../../create/event'
import { PlayState, Player, Result, Scheme } from '../../types'
import passTime from '../../passTime'
import playEffects from '../../effects/play'
import guardDefined from '../../guard/defined'
import playerSort from '../../sort/player'
import filterIds from '../../filterIds'
import clone from '../../clone'
import summonOrImprison from '../../summonOrImprison'
import addChoiceEvents from '../../add/events/choice'
import joinRanks from '../../join/ranks'
import addEvent from '../../add/event'

export default function playLastReady ({
  currentPlayer,
  playScheme,
  playState,
  trashScheme
}: {
  currentPlayer: Result<Player>
  playScheme: Scheme
  playState: PlayState
  trashScheme: Scheme
}): void {
  currentPlayer.playScheme = playScheme
  currentPlayer.trashScheme = trashScheme
  currentPlayer.playReady = true
  const joinedBefore = joinRanks(currentPlayer.hand)
  playState.players.forEach(player => {
    player.hand = player
      .hand
      .filter(scheme => scheme.id !== player.trashScheme?.id && scheme.id !== player.playScheme?.id)
    const trashScheme = guardDefined(player.trashScheme, 'Trash scheme')
    player.trashHistory.push({ scheme: trashScheme, round: playState.game.round })
  })
  const joinedAfter = joinRanks(currentPlayer.hand)
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready.`)
  const privateReadyEvent = createEvent('You are ready.')
  addEvent(privateReadyEvent, `Your hand was ${joinedBefore}`)
  addEvent(privateReadyEvent, `Your hand becomes ${joinedAfter}`)
  const everyoneEvent = createEvent('Everyone is ready.')
  playState.players.forEach(player => {
    const trashScheme = guardDefined(player.trashScheme, 'Trash scheme')
    const trashEvent = createEvent(`You trash ${trashScheme.rank}.`)
    if (player.id !== currentPlayer.id) {
      player.events.push(publicReadyEvent, everyoneEvent, trashEvent)
      return
    }
    player.events.push(privateReadyEvent, everyoneEvent, trashEvent)
  })
  playState.game.events.push(publicReadyEvent, everyoneEvent)
  playState.game.profiles.forEach(profile => {
    profile.trashHistory.push({ round: playState.game.round })
  })
  passTime({ playState })
  const playStateClone = clone(playState)
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
    summonOrImprison({ playState })
  } else {
    addChoiceEvents(playState)
  }
}
