import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addHighestRankGreenPlaySchemeEvents from '../add/events/scheme/play/rank/highest/green'
import addLeftmostTimelineSchemeIsGreenOrYellowEvents from '../add/events/scheme/timeline/leftmost/is/greenOrYellow'
import { EffectsStateProps, PlayState } from '../types'
import copyEffects from './copy'

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
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  if (!resume) {
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if the leftmost timeline scheme is green or yellow, ${effectPlayer.displayName} copies it.`)
    const firstPrivateEvent = addEvent(privateEvent, 'First, if the leftmost timeline scheme is green or yellow, you copy it.')
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
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you copy the highest rank green scheme in play.')
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
