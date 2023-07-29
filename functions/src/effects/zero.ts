import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import createPrivilege from '../create/privilege'
import joinRanksGrammar from '../join/ranks/grammar'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsZero ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  privateEvent,
  publicEvents,
  playState,
  resume
}: SchemeEffectProps): PlayState {
  const privateHandEvent = addEvent(
    privateEvent,
    'First, you take 8 Privilege into your hand.'
  )
  addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} takes 8 Privilege into their hand.`
  )
  const beforeHandJoined = joinRanksGrammar(effectPlayer.hand)
  const beforeHandMessage = `Your hand was ${beforeHandJoined.joinedRanks}.`
  addEvent(
    privateHandEvent,
    beforeHandMessage
  )
  effectPlayer.hand.unshift(...createPrivilege(8))
  const afterHandJoined = joinRanksGrammar(effectPlayer.hand)
  const afterHandMessage = `Your hand becomes ${afterHandJoined.joinedRanks}.`
  addEvent(
    privateHandEvent,
    afterHandMessage
  )
  const privateDeckEvent = addEvent(
    privateEvent,
    'Second, you put 2 Privilege on your deck.'
  )
  addPublicEvent(
    publicEvents,
    `Second, ${effectPlayer.displayName} puts 2 Privilege on their deck.`
  )
  const beforeDeckJoined = joinRanksGrammar(effectPlayer.deck)
  const beforeDeckMessage = `Your deck was ${beforeDeckJoined.joinedRanks}.`
  addEvent(
    privateDeckEvent,
    beforeDeckMessage
  )
  effectPlayer.deck.unshift(...createPrivilege(2))
  const afterDeckJoined = joinRanksGrammar(effectPlayer.deck)
  const afterDeckMessage = `Your deck becomes ${afterDeckJoined.joinedRanks}.`
  addEvent(
    privateDeckEvent,
    afterDeckMessage
  )
  return playState
}
