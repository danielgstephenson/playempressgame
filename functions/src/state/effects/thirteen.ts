import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import copyEffects from './copy'
import addAreRedTimelineSchemeEvents from '../../add/events/scheme/timeline/are/red'
import addLeftmostTimelineSchemeEvents from '../../add/events/scheme/timeline/leftmost'
import addHighestRankGreenOrYellowPlaySchemeEvents from '../../add/events/scheme/play/rank/highest/greenOrYellow'

export default function effectsThirteen ({
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
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if there are no red timeline schemes, ${effectPlayer.displayName} copies the leftmost timeline scheme.`)
    const firstPrivateEvent = addPlayerEvent({
      events: effectPlayer.history,
      message: 'First, if there are no red timeline schemes, you copy the leftmost timeline scheme.',
      playerId: effectPlayer.id,
      round: playState.game.round
    })
    const { schemes } = addAreRedTimelineSchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
    if (schemes?.length === 0) {
      const { scheme } = addLeftmostTimelineSchemeEvents({
        privateEvent: firstPrivateEvent,
        publicEvents: firstPublicChildren,
        playState
      })
      if (scheme != null) {
        const firstChoices = copyEffects({
          first: true,
          playState,
          effectPlayer,
          effectScheme: scheme,
          resume: false
        })
        if (firstChoices.length > 0) {
          return playState
        }
      }
    }
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank green or yellow scheme in play.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you copy the highest rank green or yellow scheme in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addHighestRankGreenOrYellowPlaySchemeEvents({
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
