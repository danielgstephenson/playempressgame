import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import copyEffects from './copy'
import addLeftmostTimelineSchemeIsGreenOrYellowEvents from '../../add/events/scheme/timeline/leftmost/is/greenOrYellow'
import addHighestRankGreenPlaySchemeEvents from '../../add/events/scheme/play/rank/highest/green'

export default function effectsTwelve ({
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
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if the leftmost timeline scheme is green or yellow, ${effectPlayer.displayName} copies it.`)
    const firstPrivateEvent = addPlayerEvent({
      events: effectPlayer.history,
      message: 'First, if the leftmost timeline scheme is green or yellow, copy it.',
      playerId: effectPlayer.id,
      round: playState.game.round
    })
    const { scheme } = addLeftmostTimelineSchemeIsGreenOrYellowEvents({
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren,
      playState,
      playerId: effectPlayer.id
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
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank green scheme in play.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you copy the highest rank green scheme in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addHighestRankGreenPlaySchemeEvents({
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
