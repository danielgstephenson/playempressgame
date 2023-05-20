import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import earn from '../earn'
import addLeftmostTimelineSchemeEvents from '../../add/events/scheme/timeline/leftmost'
import addHighestRankYellowPlaySchemeEvents from '../../add/events/scheme/play/rank/highest/yellow'

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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the leftmost timeline scheme's rank.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: "First, earn the leftmost timeline scheme's rank.",
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, earn the highest yellow rank in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
