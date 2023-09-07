import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPlayerPublicEvents from '../add/events/player/public'
import addHighestRankPlaySchemeEvents from '../add/events/scheme/play/rank/highest'
import addLeftmostTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost'
import earn from '../earn'
import isYellow from '../is/yellow'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsSeventeen ({
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
    message: `Second, if the highest scheme in play is yellow, ${effectPlayer.displayName} earns its rank.`
  })
  const { scheme: highScheme } = addHighestRankPlaySchemeEvents({
    playState,
    playerId: effectPlayer.id,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  addEventsEverywhere({
    message: `${highScheme.rank} is ${highScheme.color}.`,
    publicEvents,
    privateEvent
  })
  if (isYellow(highScheme)) {
    earn({
      amount: highScheme.rank,
      player: effectPlayer,
      playState,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
