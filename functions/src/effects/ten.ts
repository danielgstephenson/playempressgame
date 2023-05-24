import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addHighestRankYellowPlaySchemeEvents from '../add/events/scheme/play/rank/highest/yellow'
import addTopDiscardSchemeYellowEvents from '../add/events/scheme/topDiscard/yellow'
import { EffectsStateProps, PlayState } from '../types'
import copyEffects from './copy'

export default function effectsTen ({
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
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s top discard scheme is yellow, they copy it.`)
    const firstPrivateEvent = addEvent(privateEvent, 'First, if your top discard scheme is yellow, you copy it.')
    const scheme = addTopDiscardSchemeYellowEvents({
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren,
      displayName: effectPlayer.displayName,
      discard: effectPlayer.discard
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
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank yellow scheme in play.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you copy the highest rank yellow scheme in play.')
  const { scheme } = addHighestRankYellowPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  if (scheme == null) {
    return playState
  }
  copyEffects({
    first: false,
    playState,
    effectPlayer,
    effectScheme: scheme,
    resume: false
  })
  return playState
}
