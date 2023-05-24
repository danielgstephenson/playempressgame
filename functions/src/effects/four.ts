import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addLowestPlayTimeEvents from '../add/events/scheme/play/time/lowest'
import createPrivilege from '../create/privilege'
import draw from '../draw'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsFour ({
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
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} takes one Privilege into their hand.`)
  addEvent(privateEvent, 'First, you take one Privilege into your hand.')
  effectPlayer.hand.push(...createPrivilege(1))
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the lowest time in play.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you draw the lowest time in play.')
  const lowest = addLowestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  draw({
    depth: lowest.time,
    playState,
    player: effectPlayer,
    privateEvent: lowest.playTimeEvents.privateEvent,
    publicEvents: lowest.playTimeEvents.publicEvents
  })
  return playState
}
