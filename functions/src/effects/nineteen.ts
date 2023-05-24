import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addHighestRankYellowPlaySchemeEvents from '../add/events/scheme/play/rank/highest/yellow'
import addLeftmostTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost'
import earn from '../earn'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsNineteen ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the leftmost timeline scheme's rank.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, earn the leftmost timeline scheme\'s rank.')
  const { scheme } = addLeftmostTimelineSchemeEvents({
    playState,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} earns the highest yellow rank in play.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, earn the highest yellow rank in play.')
  const { scheme: yellowScheme } = addHighestRankYellowPlaySchemeEvents({
    playState,
    playerId: effectPlayer.id,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  if (yellowScheme != null) {
    earn({
      amount: yellowScheme.rank,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  return playState
}
