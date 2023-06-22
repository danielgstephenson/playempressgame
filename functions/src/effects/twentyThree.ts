import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPlayerPublicEvents from '../add/events/player/public'
import addHighestRankPlaySchemeEvents from '../add/events/scheme/play/rank/highest'
import addLowestRankPlaySchemeEvents from '../add/events/scheme/play/rank/lowest'
import addTopDiscardSchemeGreenEvents from '../add/events/scheme/topDiscard/green'
import draw from '../draw'
import isGreen from '../is/green'
import revive from '../revive'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsTwentyThree ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if your top discard scheme is green, revive 5.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName} top discard scheme is green, they revive 5.`)
  const scheme = addTopDiscardSchemeGreenEvents({
    discard: effectPlayer.discard,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren,
    displayName: effectPlayer.displayName
  })
  if (scheme != null) {
    revive({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, if the highest or lowest rank scheme in play is green, draw 5.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, if the highest or lowest rank scheme in play is green, ${effectPlayer.displayName} they draw 5.`
  })
  const { scheme: highScheme } = addHighestRankPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  const highMessage = `${highScheme.rank} is ${highScheme.color}.`
  addEventsEverywhere({
    publicEvents: secondPublicChildren,
    privateEvent: secondPrivateChild,
    message: highMessage
  })
  const { scheme: lowScheme } = addLowestRankPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  addEventsEverywhere({
    publicEvents: secondPublicChildren,
    privateEvent: secondPrivateChild,
    message: `${lowScheme.rank} is ${lowScheme.color}.`
  })
  const green = isGreen(highScheme) || isGreen(lowScheme)
  if (green) {
    draw({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
