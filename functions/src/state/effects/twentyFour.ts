import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import revive from '../revive'
import addLowestRankGreenPlaySchemeEvents from '../../add/events/scheme/play/rank/lowest/green'
import earn from '../earn'

export default function effectsTwentyFour ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the lowest green rank in play.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, earn the lowest green rank in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme: playScheme } = addLowestRankGreenPlaySchemeEvents({
    playState,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren,
    playerId: effectPlayer.id
  })
  if (playScheme != null) {
    earn({
      amount: playScheme.rank,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} revives their entire discard.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, revive your entire discard.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  revive({
    depth: effectPlayer.discard.length,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
