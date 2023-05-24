import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import addTopDiscardSchemeEvents from '../add/events/scheme/topDiscard'
import addTopDiscardSchemeYellowEvents from '../add/events/scheme/topDiscard/yellow'
import earn from '../earn'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsSeventeen ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s top discard scheme is yellow, they earn twice its rank.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, if your top discard scheme is yellow, you earn twice its rank.')
  const scheme = addTopDiscardSchemeYellowEvents({
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
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} puts their top discard scheme on their deck.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you put your top discard scheme on your deck.')
  const discardScheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  if (discardScheme != null) {
    effectPlayer.deck.unshift(discardScheme)
    effectPlayer.discard.pop()
    addEventsEverywhere({
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren,
      message: `${effectPlayer.displayName} puts their ${discardScheme.rank} face down on their deck.`
    })
  }
  return playState
}
