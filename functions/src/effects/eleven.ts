import addEvent from '../add/event'
import addPlayerPublicEvents from '../add/events/player/public'
import addLowestRankGreenOrYellowPlaySchemeEvents from '../add/events/scheme/play/rank/lowest/greenOrYellow'
import addTopDiscardSchemeGreenOrYellowEvents from '../add/events/scheme/topDiscard/greenOrYellow'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsEleven ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, if your top discard scheme is green or yellow, you copy it.')
    const firstPublicChildren = addPlayerPublicEvents({
      events: publicEvents,
      message: `First, if ${effectPlayer.displayName}'s top discard scheme is green or yellow, they copy it.`
    })
    const scheme = addTopDiscardSchemeGreenOrYellowEvents({
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren,
      displayName: effectPlayer.displayName,
      discard: effectPlayer.discard
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the lowest rank green or yellow scheme in play.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} copies the lowest rank green or yellow scheme in play.`
  })
  const { scheme } = addLowestRankGreenOrYellowPlaySchemeEvents({
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
