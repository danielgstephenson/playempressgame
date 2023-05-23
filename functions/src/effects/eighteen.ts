import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addTopDiscardSchemeYellowEvents from '../add/events/scheme/topDiscard/yellow'
import createPrivilege from '../create/privilege'
import earn from '../earn'
import getJoinedRanksGrammar from '../get/joined/ranks/grammar'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsEighteen ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s deck or discard is empty, they earn 30 gold.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, if your deck or discard is empty, you earn 30 gold.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const deckEmpty = effectPlayer.deck.length === 0
  if (deckEmpty) {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s deck is empty.`)
    addEvent(firstPrivateEvent, 'Your deck is empty.')
  } else {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s deck is not empty.`)
    const { joinedCount } = getJoinedRanksGrammar(effectPlayer.deck)
    addEvent(firstPrivateEvent, `Your deck has ${joinedCount}.`)
  }
  const discardEmpty = effectPlayer.discard.length === 0
  if (discardEmpty) {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s discard is empty.`)
    addEvent(firstPrivateEvent, 'Your discard is empty.')
  } else {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s discard is not empty.`)
    const { joinedCount } = getJoinedRanksGrammar(effectPlayer.discard)
    addEvent(firstPrivateEvent, `Your discard has ${joinedCount}.`)
  }
  if (deckEmpty || discardEmpty) {
    earn({
      amount: 30,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
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
  addPublicEvent(publicEvents, 'Second, one Privilege is summoned to the court')
  addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, one Privilege is summoned to the court.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  playState.game.court.push(...createPrivilege(1))
  return playState
}
