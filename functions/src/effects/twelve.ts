import addEvent from '../add/event'
import addPlayerPublicEvents from '../add/events/player/public'
import addHighestRankGreenPlaySchemeEvents from '../add/events/scheme/play/rank/highest/green'
import addLeftmostTimelineSchemeIsGreenOrYellowEvents from '../add/events/scheme/timeline/leftmost/is/greenOrYellow'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsTwelve ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, if the leftmost timeline scheme is green or yellow, you copy it.')
    const firstPublicChildren = addPlayerPublicEvents({
      events: publicEvents,
      message: `First, if the leftmost timeline scheme is green or yellow, ${effectPlayer.displayName} copies it.`
    })
    const { scheme } = addLeftmostTimelineSchemeIsGreenOrYellowEvents({
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren,
      playState,
      playerId: effectPlayer.id
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the highest rank green scheme in play.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} copies the highest rank green scheme in play.`
  })
  const { scheme } = addHighestRankGreenPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
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
  return playState
}
