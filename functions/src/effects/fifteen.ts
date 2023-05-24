import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import addLeftmostGreenTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost/green'
import addTopDiscardSchemeEvents from '../add/events/scheme/topDiscard'
import addTopDiscardSchemeRedEvents from '../add/events/scheme/topDiscard/red'
import isRed from '../is/red'
import { EffectsStateProps, PlayState } from '../types'
import copyEffects from './copy'

export default function effectsFifteen ({
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
  if (!resume) {
    const firstPublicChildren = addPublicEvent(publicEvents, `If your top discard scheme is red, ${effectPlayer.displayName} copies the leftmost green timeline scheme.`)
    const firstPrivateEvent = addEvent(privateEvent, 'If your top discard scheme is red, you copy the leftmost green timeline scheme.')
    const scheme = addTopDiscardSchemeRedEvents({
      discard: effectPlayer.discard,
      displayName: effectPlayer.displayName,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
    if (scheme != null) {
      const { scheme } = addLeftmostGreenTimelineSchemeEvents({
        privateEvent: firstPrivateEvent,
        publicEvents: firstPublicChildren,
        playState
      })
      if (scheme != null) {
        const firstChoices = copyEffects({
          first: true,
          playState,
          effectPlayer,
          effectScheme: scheme,
          resume: false
        })
        if (firstChoices.length > 0) {
          return playState
        }
      }
    }
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Otherwise, ${effectPlayer.displayName} copies their top discard scheme.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Otherwise, you copy your top discard scheme.')
  const scheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  if (scheme != null) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateEvent,
      suffix: `top discard scheme is ${scheme.rank}, which is ${scheme.color}.`,
      displayName: effectPlayer.displayName
    })
  }
  if (!isRed(scheme)) {
    if (scheme != null) {
      copyEffects({
        first: false,
        playState,
        effectPlayer,
        effectScheme: scheme,
        resume: false
      })
    }
  }
  return playState
}
