import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import addTopDiscardSchemeEvents from '../add/events/scheme/topDiscard'
import earn from '../earn'
import isYellow from '../is/yellow'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsTwenty ({
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
  const firstPublicChildren = addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} earns twice their top discard scheme's rank.`
  )
  const firstPrivateEvent = addEvent(privateEvent, 'First, earn twice your top discard scheme\'s rank.')
  const scheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank * 2,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s top discard scheme is not yellow, it is summoned to the court.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, if your top discard scheme is not yellow, it is summoned to the court.')
  const topDiscardScheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  if (topDiscardScheme != null && !isYellow(topDiscardScheme)) {
    addEventsEverywhere({
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren,
      suffix: `top discard scheme, ${topDiscardScheme.rank}, is summoned to the court`,
      displayName: effectPlayer.displayName
    })
    earn({
      amount: topDiscardScheme.rank,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  return playState
}
