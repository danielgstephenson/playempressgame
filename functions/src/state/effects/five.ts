import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps, Scheme } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import draw from '../draw'
import addLowestPlayTimeEvents from '../../add/events/lowestPlayTime'
import addTopDiscardSchemeTimeEvents from '../../add/events/topDiscardSchemeTime'
import revive from '../revive'
import guardPlayHandScheme from '../../guard/playHandScheme'
import getGrammar from '../../get/grammar'
import addSortedPlayerEvents from '../../add/events/sortedPlayer'

export default function effectsFive ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  resume
}: EffectsStateProps): PlayState {
  const publicEvents = addPublicEvents({
    effectPlayer,
    playState,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`
  })
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives their top discard scheme's time.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you revive your top discard scheme\'s time.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const topDiscardSchemeTime = addTopDiscardSchemeTimeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  revive({
    depth: topDiscardSchemeTime,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws twice the number of colors in play.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you draw twice the number of colors in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const uniqueColors = playState.players.reduce<string[]>((uniqueColors, player) => {
    const playScheme = guardPlayHandScheme(player)
    if (uniqueColors.includes(playScheme.color)) return uniqueColors
    return [...uniqueColors, playScheme.color]
  }, [])
  const doubleColors = uniqueColors.length * 2
  const { phrase } = getGrammar(uniqueColors.length, 'color', 'colors')
  const publicMessage = `There ${phrase} in play, so ${effectPlayer.displayName} draws ${doubleColors}`
  const privateMessage = `There ${phrase} in play, so you draw ${doubleColors}`
  function templateCallback (scheme: Scheme): string {
    return `which is ${scheme.color}.`
  }
  addSortedPlayerEvents({
    publicEvents: secondPublicChildren,
    privateEvent: secondPrivateEvent,
    publicMessage,
    privateMessage,
    playerId: effectPlayer.id,
    playState,
    templateCallback
  })
  const lowest = addLowestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  draw({
    depth: lowest.time,
    playState,
    player: effectPlayer,
    privateEvent: lowest.playTimeEvents.privateEvent,
    publicEvents: lowest.playTimeEvents.publicEvents
  })
  return playState
}
