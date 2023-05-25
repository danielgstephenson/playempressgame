import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addLeftmostGreenTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost/green'
import addTopDiscardSchemeEvents from '../add/events/scheme/topDiscard'
import addTopDiscardSchemeRedEvents from '../add/events/scheme/topDiscard/red'
import isRed from '../is/red'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsFifteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'If your top discard scheme is red, you copy the leftmost green timeline scheme.')
    const firstPublicChildren = addPublicEvent(publicEvents, `If your top discard scheme is red, ${effectPlayer.displayName} copies the leftmost green timeline scheme.`)
    const scheme = addTopDiscardSchemeRedEvents({
      discard: effectPlayer.discard,
      displayName: effectPlayer.displayName,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
    if (scheme != null) {
      const { scheme } = addLeftmostGreenTimelineSchemeEvents({
        privateEvent: firstPrivateChild,
        publicEvents: firstPublicChildren,
        playState
      })
      if (scheme != null) {
        const firstChoices = copyEffects({
          copiedByFirstEffect: true,
          effectPlayer,
          effectScheme: scheme,
          playState,
          privateEvent: firstPrivateChild,
          publicEvents: firstPublicChildren,
          resume: false
        })
        if (firstChoices.length > 0) {
          return playState
        }
      }
    }
  }
  const secondPrivateChild = addEvent(privateEvent, 'Otherwise, you copy your top discard scheme.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Otherwise, ${effectPlayer.displayName} copies their top discard scheme.`)
  const scheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  if (scheme != null) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateChild,
      suffix: `top discard scheme is ${scheme.rank}, which is ${scheme.color}.`,
      displayName: effectPlayer.displayName
    })
  }
  if (!isRed(scheme)) {
    if (scheme != null) {
      copyEffects({
        copiedByFirstEffect: false,
        effectPlayer,
        effectScheme: scheme,
        playState,
        privateEvent: secondPrivateChild,
        publicEvents: secondPublicChildren,
        resume: false
      })
    }
  }
  return playState
}
