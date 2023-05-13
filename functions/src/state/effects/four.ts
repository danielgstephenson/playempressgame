import addPublicEvents from '../../add/publicEvents'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/publicEvent'
import addPlayerEvent from '../../add/playerEvent'
import drawState from '../draw'
import createPrivilege from '../../create/privilege'
import addLowestPlayTimeEvents from '../../add/lowestPlayTimeEvents'

export default function effectsFourState ({
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
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} takes one Privilege into their hand.`)
  addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you take one Privilege into your hand.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  effectPlayer.hand.push(...createPrivilege(1))
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the lowest time in play.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you draw the lowest time in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const lowest = addLowestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  drawState({
    depth: lowest.time,
    playState,
    player: effectPlayer,
    privateEvent: lowest.playTimeEvents.privateEvent,
    publicEvents: lowest.playTimeEvents.publicEvents
  })
  return playState
}
