import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addHighestPlayTimeEvents from '../add/events/scheme/play/time/highest'
import createPrivilege from '../create/privilege'
import draw from '../draw'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsThree ({
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
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} puts three Privilege on their discard.`)
  addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you put three Privilege on your discard.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  effectPlayer.discard.push(...createPrivilege(3))
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the highest time in play.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you draw the highest time in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const highest = addHighestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateEvent,
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
