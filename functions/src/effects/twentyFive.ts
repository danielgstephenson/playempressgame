import revive from '../revive'
import draw from '../draw'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import { EffectsStateProps, PlayState } from '../types'
import addEvent from '../add/event'

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
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName} has 50 or less gold, they revive 5.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, if you have 50 or less gold, revive 5.')
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
  const secondPrivateEvent = addEvent(privateEvent, 'Second, if your discard is empty, draw 5.')
  draw({
    depth: 5,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
