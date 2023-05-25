import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addSortedPlayerEvents from '../add/events/player/sorted'
import addTopDiscardSchemeTimeEvents from '../add/events/scheme/topDiscard/time'
import draw from '../draw'
import getGrammar from '../get/grammar'
import guardPlayScheme from '../guard/playScheme'
import revive from '../revive'
import { PlayState, Scheme, SchemeEffectProps } from '../types'

export default function effectsFive ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  privateEvent,
  publicEvents,
  playState,
  resume
}: SchemeEffectProps): PlayState {
  console.log('effectsFive')
  const firstPrivateChild = addEvent(privateEvent, 'First, revive your top discard scheme\'s time.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives their top discard scheme's time.`)
  const topDiscardSchemeTime = addTopDiscardSchemeTimeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  revive({
    depth: topDiscardSchemeTime,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  const secondPrivateChild = addEvent(privateEvent, 'Second, draw twice the number of colors in play.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws twice the number of colors in play.`)
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
    privateEvent: secondPrivateChild,
    publicMessage,
    privateMessage,
    playerId: effectPlayer.id,
    playState,
    templateCallback
  })
  draw({
    depth: doubleColors,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
