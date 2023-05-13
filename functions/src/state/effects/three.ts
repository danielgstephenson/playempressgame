import addPublicEvents from '../../add/publicEvents'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/publicEvent'
import addPlayerEvent from '../../add/playerEvent'
import drawState from '../draw'
import createPrivilege from '../../create/privilege'
import addHighestPlayTimeEvents from '../../add/highestPlayTimeEvents'

export default function effectsThreeState ({
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
  drawState({
    depth: highest.time,
    playState,
    player: effectPlayer,
    privateEvent: highest.playTimeEvents.privateEvent,
    publicEvents: highest.playTimeEvents.publicEvents
  })
  return playState
}
