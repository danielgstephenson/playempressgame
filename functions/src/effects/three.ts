import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addPlayerPublicEvents from '../add/events/player/public'
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
  addEvent(privateEvent, 'First, you reserve three Privilege from the bank.')
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} reserves three Privilege from the bank.`)
  effectPlayer.reserve.push(...createPrivilege(3))
  const secondPrivateChild = addEvent(privateEvent, 'Second, you draw the highest time in play.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} draws the highest time in play.`
  })
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
