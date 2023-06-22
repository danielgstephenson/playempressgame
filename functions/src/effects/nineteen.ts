import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addPlayerPublicEvents from '../add/events/player/public'
import addHighestRankYellowPlaySchemeEvents from '../add/events/scheme/play/rank/highest/yellow'
import addLeftmostTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost'
import earn from '../earn'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsNineteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, earn the leftmost timeline scheme\'s rank.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the leftmost timeline scheme's rank.`)
  const { scheme } = addLeftmostTimelineSchemeEvents({
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, earn the highest yellow rank in play.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} earns the highest yellow rank in play.`
  })
  const { scheme: yellowScheme } = addHighestRankYellowPlaySchemeEvents({
    playState,
    playerId: effectPlayer.id,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  if (yellowScheme != null) {
    earn({
      amount: yellowScheme.rank,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  return playState
}
