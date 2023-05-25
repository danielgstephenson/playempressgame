import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addLowestRankGreenOrYellowDungeonSchemeEvents from '../add/events/scheme/dungeon/rank/lowest/greenOrYellow'
import addLeftmostYellowTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost/yellow'
import guardDefined from '../guard/defined'
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
    const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} copies the leftmost yellow timeline scheme.`)
    const firstPrivateEvent = addEvent(privateEvent, 'First, you copy the leftmost yellow timeline scheme.')
    const { scheme } = addLeftmostYellowTimelineSchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
    if (scheme != null) {
      const timelineScheme = guardDefined(scheme, 'Leftmost yellow timeline scheme')
      const firstChoices = copyEffects({
        copiedByFirstEffect: true,
        effectPlayer,
        effectScheme: timelineScheme,
        playState,
        privateEvent: firstPrivateEvent,
        publicEvents: firstPublicChildren,
        resume: false
      })
      if (firstChoices.length > 0) {
        return playState
      }
    }
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank green dungeon scheme.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you copy the highest rank green dungeon scheme.')
  const { scheme } = addLowestRankGreenOrYellowDungeonSchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  if (scheme != null) {
    copyEffects({
      copiedByFirstEffect: false,
      effectPlayer,
      effectScheme: scheme,
      playState,
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren,
      resume: false
    })
  }
  return playState
}
