import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addSortedPlayerEvents from '../add/events/player/sorted'
import addPublicEvents from '../add/events/public'
import addLowestPlayTimeEvents from '../add/events/scheme/play/time/lowest'
import addTopDiscardSchemeTimeEvents from '../add/events/scheme/topDiscard/time'
import draw from '../draw'
import getGrammar from '../get/grammar'
import guardPlayScheme from '../guard/playScheme'
import revive from '../revive'
import { EffectsStateProps, PlayState, Scheme } from '../types'

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
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives their top discard scheme's time.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, you revive your top discard scheme\'s time.')
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
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you draw twice the number of colors in play.')
  const uniqueColors = playState.players.reduce<string[]>((uniqueColors, player) => {
    const playScheme = guardPlayScheme(player)
    if (uniqueColors.includes(playScheme.color)) return uniqueColors
    return [...uniqueColors, playScheme.color]
  }, [])
  const doubleColors = uniqueColors.length * 2
  const { toBeCount: phrase } = getGrammar(uniqueColors.length, 'color', 'colors')
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
