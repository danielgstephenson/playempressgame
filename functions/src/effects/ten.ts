import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addHighestRankYellowPlaySchemeEvents from '../add/events/scheme/play/rank/highest/yellow'
import addTopDiscardSchemeYellowEvents from '../add/events/scheme/topDiscard/yellow'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsTen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, if your top discard scheme is yellow, you copy it.')
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s top discard scheme is yellow, they copy it.`)
    const scheme = addTopDiscardSchemeYellowEvents({
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the highest rank yellow scheme in play.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank yellow scheme in play.`)
  const { scheme } = addHighestRankYellowPlaySchemeEvents({
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
