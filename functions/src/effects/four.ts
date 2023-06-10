import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addLowestPlayTimeEvents from '../add/events/scheme/play/time/lowest'
import createPrivilege from '../create/privilege'
import draw from '../draw'
import getJoinedRanks from '../get/joined/ranks'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsFour ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  addEvent(
    privateEvent,
    'First, you take one Privilege into your hand.'
  )
  const firstPublicEvents = addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} takes one Privilege into their hand.`
  )
  const before = getJoinedRanks(effectPlayer.hand)
  addPublicEvent(firstPublicEvents, `Your hand was ${before}.`)
  effectPlayer.hand.push(...createPrivilege(1))
  const after = getJoinedRanks(effectPlayer.hand)
  addPublicEvent(firstPublicEvents, `Your hand becomes ${after}.`)
  const secondPrivateChild = addEvent(
    privateEvent,
    'Second, you draw the lowest time in play.'
  )
  const secondPublicChildren = addPublicEvent(
    publicEvents,
    `Second, ${effectPlayer.displayName} draws the lowest time in play.`
  )
  const lowest = addLowestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  draw({
    depth: lowest.time,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
