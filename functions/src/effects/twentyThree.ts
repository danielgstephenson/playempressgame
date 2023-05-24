import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import addHighestRankPlaySchemeEvents from '../add/events/scheme/play/rank/highest'
import addLowestRankPlaySchemeEvents from '../add/events/scheme/play/rank/lowest'
import addTopDiscardSchemeGreenEvents from '../add/events/scheme/topDiscard/green'
import draw from '../draw'
import isGreen from '../is/green'
import revive from '../revive'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsTwentyThree ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName} top discard scheme is green, they revive 5.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, if your top discard scheme is green, revive 5.')
  const scheme = addTopDiscardSchemeGreenEvents({
    discard: effectPlayer.discard,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren,
    displayName: effectPlayer.displayName
  })
  if (scheme != null) {
    revive({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if the highest or lowest rank scheme in play is green, ${effectPlayer.displayName} they draw 5.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, if the highest or lowest rank scheme in play is green, draw 5.')
  const { scheme: highScheme } = addHighestRankPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  const highMessage = `${highScheme.rank} is ${highScheme.color}.`
  addEventsEverywhere({
    publicEvents: secondPublicChildren,
    privateEvent: secondPrivateEvent,
    message: highMessage
  })
  const { scheme: lowScheme } = addLowestRankPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  addEventsEverywhere({
    publicEvents: secondPublicChildren,
    privateEvent: secondPrivateEvent,
    message: `${lowScheme.rank} is ${lowScheme.color}.`
  })
  const green = isGreen(highScheme) || isGreen(lowScheme)
  if (green) {
    draw({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
