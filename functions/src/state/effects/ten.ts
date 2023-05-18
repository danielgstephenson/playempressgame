import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import copyEffects from './copy'
import addLowestRankGreenOrYellowDungeonSchemeEvents from '../../add/events/scheme/dungeon/rank/lowest/greenOrYellow'
import guardDefined from '../../guard/defined'
import addLeftmostYellowTimelineSchemeEvents from '../../add/events/scheme/timeline/leftmostYellow'

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
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s top discard scheme is yellow, they copy it.`)
    const firstPrivateEvent = addPlayerEvent({
      events: effectPlayer.history,
      message: 'First, if your top discard scheme is yellow, copy it.',
      playerId: effectPlayer.id,
      round: playState.game.round
    })
    const { scheme } = addLeftmostYellowTimelineSchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren,
      playerId: effectPlayer.id
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
  copyEffects({
    first: false,
    playState,
    effectPlayer,
    effectScheme: scheme,
    resume: false
  })
  return playState
}
