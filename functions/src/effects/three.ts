import addEvent from '../add/event'
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
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} puts three Privilege on their discard.`)
  addEvent(privateEvent, 'First, you put three Privilege on your discard.')
  effectPlayer.discard.push(...createPrivilege(3))
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the highest time in play.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you draw the highest time in play.')
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
