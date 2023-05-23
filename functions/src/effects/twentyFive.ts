import revive from '../revive'
import draw from '../draw'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsTwentyFive ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName} has 50 or less gold, they revive 5.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, if you have 50 or less gold, revive 5.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  if (effectPlayer.gold <= 50) {
    revive({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s discard is empty, draw 5.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, if your discard is empty, draw 5.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  draw({
    depth: 5,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
