import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addLowestRankGreenOrYellowDungeonSchemeEvents from '../add/events/scheme/dungeon/rank/lowest/greenOrYellow'
import addLeftmostYellowTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost/yellow'
import guardDefined from '../guard/defined'
import { EffectsStateProps, PlayState } from '../types'
import copyEffects from './copy'

export default function effectsNine ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  resume
}: EffectsStateProps): PlayState {
  const publicEvents = addPublicEvents({
    effectPlayer,
    playState,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`
  })
  if (!resume) {
    const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} copies the leftmost yellow timeline scheme.`)
    const firstPrivateEvent = addPlayerEvent({
      events: effectPlayer.history,
      message: 'First, you copy the leftmost yellow timeline scheme.',
      playerId: effectPlayer.id,
      round: playState.game.round
    })
    const { scheme } = addLeftmostYellowTimelineSchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
    if (scheme != null) {
      const timelineScheme = guardDefined(scheme, 'Leftmost yellow timeline scheme')
      const firstChoices = copyEffects({
        first: true,
        playState,
        effectPlayer,
        effectScheme: timelineScheme,
        resume: false
      })
      if (firstChoices.length > 0) {
        return playState
      }
    }
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank green dungeon scheme.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you copy the highest rank green dungeon scheme.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addLowestRankGreenOrYellowDungeonSchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  if (scheme != null) {
    copyEffects({
      first: false,
      playState,
      effectPlayer,
      effectScheme: scheme,
      resume: false
    })
  }
  return playState
}
