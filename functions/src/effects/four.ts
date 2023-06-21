import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addLowestPlayTimeEvents from '../add/events/scheme/play/time/lowest'
import createPrivilege from '../create/privilege'
import draw from '../draw'
import joinRanks from '../join/ranks'
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
  const firstPrivateEvent = addEvent(
    privateEvent,
    'First, you take one Privilege into your hand.'
  )
  const firstPublicEvents = addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} takes one Privilege into their hand.`
  )
  const before = joinRanks(effectPlayer.hand)
  addEvent(firstPrivateEvent, `Your hand was ${before}.`)
  effectPlayer.hand.push(...createPrivilege(1))
  const after = joinRanks(effectPlayer.hand)
  addEvent(firstPrivateEvent, `Your hand becomes ${after}.`)
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
