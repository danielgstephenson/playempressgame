import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addRightmostTimelineSchemeEvents from '../add/events/scheme/timeline/rightmost'
import earn from '../earn'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsTwentyTwo ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {

  const firstPrivateChild = addEvent(privateEvent, 'Second, earn 5 gold for each dungeon scheme.')
  const firstPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} earns 5 gold for each dungeon scheme.`)
  const dungeonAmount = playState.game.dungeon.length * 5
  earn({
    amount: dungeonAmount,
    player: effectPlayer,
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  const secondPrivateChild = addEvent(privateEvent, 'First, earn the rightmost timeline scheme\'s rank.')
  const secondPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the rightmost timeline scheme's rank.`)
  const { scheme } = addRightmostTimelineSchemeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank,
      player: effectPlayer,
      playState,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
