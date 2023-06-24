import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import createPrivilege from '../create/privilege'
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
  addEvent(
    privateEvent,
    'First, you take 8 Privilege into your hand.'
  )
  addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} takes 8 Privilege into their hand.`
  )
  effectPlayer.hand.unshift(...createPrivilege(8))
  addEvent(
    privateEvent,
    'Second, you put 2 Privilege on your deck.'
  )
  addPublicEvent(
    publicEvents,
    `Second, ${effectPlayer.displayName} puts 2 Privilege on their deck.`
  )
  effectPlayer.deck.push(...createPrivilege(2))
  return playState
}
