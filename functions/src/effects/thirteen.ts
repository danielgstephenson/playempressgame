import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addHighestRankGreenOrYellowPlaySchemeEvents from '../add/events/scheme/play/rank/highest/greenOrYellow'
import addAreRedTimelineSchemeEvents from '../add/events/scheme/timeline/are/red'
import addLeftmostTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsThirteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, if there are no red timeline schemes, you copy the leftmost timeline scheme.')
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if there are no red timeline schemes, ${effectPlayer.displayName} copies the leftmost timeline scheme.`)
    const { schemes } = addAreRedTimelineSchemeEvents({
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
    if (schemes?.length === 0) {
      const { scheme } = addLeftmostTimelineSchemeEvents({
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the highest rank green or yellow scheme in play.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank green or yellow scheme in play.`)
  const { scheme } = addHighestRankGreenOrYellowPlaySchemeEvents({
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
