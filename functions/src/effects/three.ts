import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addHighestPlayTimeEvents from '../add/events/scheme/play/time/highest'
import createPrivilege from '../create/privilege'
import draw from '../draw'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsThree ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  addEvent(privateEvent, 'First, you put three Privilege on your discard.')
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} puts three Privilege on their discard.`)
  effectPlayer.discard.push(...createPrivilege(3))
  const secondPrivateChild = addEvent(privateEvent, 'Second, you draw the highest time in play.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the highest time in play.`)
  const highest = addHighestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  draw({
    depth: highest.time,
    playState,
    player: effectPlayer,
    privateEvent: highest.playTimeEvents.privateEvent,
    publicEvents: highest.playTimeEvents.publicEvents
  })
  return playState
}
