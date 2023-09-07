import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import createPrivilege from '../create/privilege'
import joinRanksGrammar from '../join/ranks/grammar'
import { PlayState, SchemeEffectProps } from '../types'
import earn from '../earn'

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
    'First, you take 10 Privilege into your hand.'
  )
  addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} takes 10 Privilege into their hand.`
  )
  const beforeHandJoined = joinRanksGrammar(effectPlayer.hand)
  const beforeHandMessage = `Your hand was ${beforeHandJoined.joinedRanks}.`
  addEvent(
    privateHandEvent,
    beforeHandMessage
  )
  effectPlayer.hand.unshift(...createPrivilege(9))
  const afterHandJoined = joinRanksGrammar(effectPlayer.hand)
  const afterHandMessage = `Your hand becomes ${afterHandJoined.joinedRanks}.`
  addEvent(
    privateHandEvent,
    afterHandMessage
  )
  const secondPrivateChild = addEvent(
    privateEvent,
    'Second, you earn 5 gold.'
  )
  const secondPublicChildren = addPublicEvent(
    publicEvents,
    `Second, ${effectPlayer.displayName} earns 5 gold.`
  )
  earn({
    amount: 5,
    player: effectPlayer,
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
