import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addLowestRankGreenPlaySchemeEvents from '../add/events/scheme/play/rank/lowest/green'
import earn from '../earn'
import revive from '../revive'
import { EffectsStateProps, PlayState } from '../types'

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
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the lowest green rank in play.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, earn the lowest green rank in play.')
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
  const secondPrivateEvent = addEvent(privateEvent, 'Second, revive your entire discard.')
  revive({
    depth: effectPlayer.discard.length,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
