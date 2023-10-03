import addEvent from '../add/event'
import addPlayerPublicEvents from '../add/events/player/public'
import addLowestRankGreenPlaySchemeEvents from '../add/events/scheme/play/rank/lowest/green'
import addLastReserveYellowEvents from '../add/events/scheme/lastReserve/yellow'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsNine ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, if your last reserve is yellow, you copy it.')
    const firstPublicChildren = addPlayerPublicEvents({
      events: publicEvents,
      message: `First, if ${effectPlayer.displayName}'s last reserve is yellow, they copy it.`
    })
    const scheme = addLastReserveYellowEvents({
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren,
      displayName: effectPlayer.displayName,
      reserve: effectPlayer.reserve
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the lowest rank green scheme in play.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} copies the lowest rank green scheme in play.`
  })
  const { scheme } = addLowestRankGreenPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  if (scheme == null) {
    return playState
  }
  copyEffects({
    copiedByFirstEffect: false,
    effectPlayer,
    effectScheme: scheme,
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    resume: false
  })

  return playState
}
