import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import createChoice from '../create/choice'
import earn from '../earn'
import getGrammar from '../get/grammar'
import getJoinedRanks from '../get/joined/ranks'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsSixteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if you have 5 or less schemes in hand, you earn 25 gold.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if  ${effectPlayer.displayName} has 5 or less schemes in hand, they earn 25 gold.`)
  const less = effectPlayer.hand.length < 6
  const { count } = getGrammar(effectPlayer.hand.length)
  const joined = getJoinedRanks(effectPlayer.hand)
  const privateMessage = `You have ${count} in hand, ${joined}.`
  addEvent(firstPrivateChild, privateMessage)
  const lessMessage = less ? '5 or less schemes' : 'more than 5 schemes'
  const publicMessage = `${effectPlayer.displayName} has ${lessMessage} in hand.`
  addPublicEvent(firstPublicChildren, publicMessage)
  const lessBonus = less ? 25 : 0
  earn({
    amount: lessBonus,
    player: effectPlayer,
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  const secondPrivateChild = addEvent(privateEvent, 'Second, if you took gold, put 1 scheme from your hand on your deck.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName} took gold, they put 1 scheme from their hand on their deck.`)
  if (less) {
    addEventsEverywhere({
      possessive: false,
      suffix: 'just took 25 gold',
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      displayName: effectPlayer.displayName
    })
    const choice = createChoice({
      copiedByFirstEffect,
      effectPlayer,
      effectScheme,
      type: 'deck'
    })
    playState.game.choices.push(choice)
  } else {
    addEventsEverywhere({
      possessive: false,
      suffix: 'did not take gold',
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      displayName: effectPlayer.displayName
    })
  }
  return playState
}
