import addEvent from '../add/event'
import addEventsEverywhere from '../add/events/everywhere'
import addPlayerPublicEvents from '../add/events/player/public'
import addLeftmostGreenTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost/green'
import addLastReserveSchemeEvents from '../add/events/scheme/lastReserve'
import addLastReserveRedEvents from '../add/events/scheme/lastReserve/red'
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
  resume,
  threat
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'If your last reserve is red, you copy the leftmost green timeline scheme.')
    const firstPublicChildren = addPlayerPublicEvents({
      events: publicEvents,
      message: `If your last reserve is red, ${effectPlayer.displayName} copies the leftmost green timeline scheme.`
    })
    const scheme = addLastReserveRedEvents({
      reserve: effectPlayer.reserve,
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
          resume: false,
          threat
        })
        if (firstChoices.length > 0) {
          return playState
        }
      }
    }
  }
  const secondPrivateChild = addEvent(privateEvent, 'Otherwise, you copy your last reserve.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Otherwise, ${effectPlayer.displayName} copies their last reserve.`
  })
  const scheme = addLastReserveSchemeEvents({
    reserve: effectPlayer.reserve,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  if (scheme != null) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateChild,
      suffix: `last reserve, ${scheme.rank}, is ${scheme.color}`,
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
        resume: false,
        threat
      })
    }
  }
  return playState
}
