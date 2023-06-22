import addEvent from '../add/event'
import addPlayerPublicEvents from '../add/events/player/public'
import addHighestRankGreenOrYellowDungeonSchemeEvents from '../add/events/scheme/dungeon/rank/highest/greenOrYellow'
import addLowerRankPlaySchemeEvents from '../add/events/scheme/play/rank/lower'
import addRightmostYellowTimelineSchemeEvents from '../add/events/scheme/timeline/rightmost/yellow'
import { PlayState, SchemeEffectProps } from '../types'
import copyEffects from './copy'

export default function effectsFourteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  if (!resume) {
    const firstPrivateChild = addEvent(privateEvent, 'First, if there is a lower rank scheme in play, you copy the rightmost yellow timeline scheme.')
    const firstPublicChildren = addPlayerPublicEvents({
      events: publicEvents,
      message: `First, if there is a lower rank scheme in play, ${effectPlayer.displayName} copies the rightmost yellow timeline scheme.`
    })
    const { scheme } = addLowerRankPlaySchemeEvents({
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren,
      rank: effectScheme.rank,
      playerId: effectPlayer.id
    })
    if (scheme != null) {
      const { scheme } = addRightmostYellowTimelineSchemeEvents({
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, you copy the highest rank green or yellow dungeon scheme.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} copies the highest rank green or yellow dungeon scheme.`
  })
  const { scheme } = addHighestRankGreenOrYellowDungeonSchemeEvents({
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
