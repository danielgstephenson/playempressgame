import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addLowestRankGreenPlaySchemeEvents from '../add/events/scheme/play/rank/lowest/green'
import earn from '../earn'
import revive from '../revive'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsTwentyFour ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, earn the lowest green rank in play.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the lowest green rank in play.`)
  const { scheme: playScheme } = addLowestRankGreenPlaySchemeEvents({
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren,
    playerId: effectPlayer.id
  })
  if (playScheme != null) {
    earn({
      amount: playScheme.rank,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, revive your entire discard.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} revives their entire discard.`)
  revive({
    depth: effectPlayer.discard.length,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
