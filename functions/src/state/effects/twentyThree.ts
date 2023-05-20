import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import draw from '../draw'
import revive from '../revive'
import addEventsEverywhere from '../../add/events/everywhere'
import addTopDiscardSchemeGreenEvents from '../../add/events/scheme/topDiscard/green'
import addLowestRankPlaySchemeEvents from '../../add/events/scheme/play/rank/lowest'
import addHighestRankPlaySchemeEvents from '../../add/events/scheme/play/rank/highest'
import isGreen from '../../is/green'

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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName} top discard scheme is green, they revive 5.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, if your top discard scheme is green, revive 5.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, if the highest or lowest rank scheme in play is green, draw 5.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
