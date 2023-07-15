import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addTopDiscardSchemeEvents from '../add/events/scheme/topDiscard'
import addTopDiscardSchemeYellowEvents from '../add/events/scheme/topDiscard/yellow'
import earn from '../earn'
import joinRanksGrammar from '../join/ranks/grammar'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsSeventeen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if your top discard scheme is yellow, you earn twice its rank.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s top discard scheme is yellow, they earn twice its rank.`)
  const scheme = addTopDiscardSchemeYellowEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank * 2,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, you put your top discard scheme on your deck.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} puts their top discard scheme on their deck.`)
  const discardScheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  if (discardScheme != null) {
    const deckBeforeJoined = joinRanksGrammar(effectPlayer.deck)
    const deckBeforeMessage = `Your deck was ${deckBeforeJoined.joinedRanks}.`
    effectPlayer.deck.unshift(discardScheme)
    const deckAfterJoined = joinRanksGrammar(effectPlayer.deck)
    const deckAfterMessage = `Your deck becomes ${deckAfterJoined.joinedRanks}.`
    effectPlayer.discard.shift()
    const { privateEvent } = addEventsEverywhere({
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      publicMessage: `${effectPlayer.displayName} puts their ${discardScheme.rank} on their deck.`,
      privateMessage: `You put your ${discardScheme.rank} on their deck.`
    })
    addEvent(privateEvent, deckBeforeMessage)
    addEvent(privateEvent, deckAfterMessage)
  }
  return playState
}
