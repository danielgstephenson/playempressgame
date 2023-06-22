import addEvent from '../add/event'
import addPlayerPublicEvents from '../add/events/player/public'
import addLowestRankGreenOrYellowDungeonSchemeEvents from '../add/events/scheme/dungeon/rank/lowest/greenOrYellow'
import addLowestRankYellowPlaySchemeEvents from '../add/events/scheme/play/rank/lowest/yellow'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsEight ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, you copy the lowest rank yellow scheme in play.')
    const firstPublicChildren = addPlayerPublicEvents({
      events: publicEvents,
      message: `First, ${effectPlayer.displayName} copies the lowest rank yellow scheme in play.`
    })
    const { scheme } = addLowestRankYellowPlaySchemeEvents({
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren,
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the lowest rank green or yellow dungeon scheme.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} copies the lowest rank green or yellow dungeon scheme.`
  })
  const { scheme } = addLowestRankGreenOrYellowDungeonSchemeEvents({
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
