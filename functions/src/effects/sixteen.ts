import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import createChoice from '../create/choice'
import earn from '../earn'
import getGrammar from '../get/grammar'
import joinRanks from '../join/ranks'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsSixteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume,
  threat
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if you have five or less schemes in hand, you earn twenty five gold.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if  ${effectPlayer.displayName} has five or less schemes in hand, they earn twenty five gold.`)
  const less = effectPlayer.hand.length < 6
  const { count } = getGrammar(effectPlayer.hand.length)
  const joined = joinRanks(effectPlayer.hand)
  const privateMessage = `You have ${count} in hand, ${joined}.`
  addEvent(firstPrivateChild, privateMessage)
  const lessMessage = less ? 'five or less schemes' : 'more than five schemes'
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, if you took gold, put one scheme from your hand on your deck.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName} took gold, they put one scheme from their hand on their deck.`)
  if (less) {
    const justMessage = 'just took twenty five gold'
    if (effectPlayer.hand.length === 0) {
      addEventsEverywhere({
        possessive: false,
        publicSuffix: `${justMessage}, but their hand is empty`,
        privateSuffix: `${justMessage}, but your hand is empty`,
        privateEvent: secondPrivateChild,
        publicEvents: secondPublicChildren,
        displayName: effectPlayer.displayName
      })
    } else {
      addEventsEverywhere({
        possessive: false,
        suffix: justMessage,
        privateEvent: secondPrivateChild,
        publicEvents: secondPublicChildren,
        displayName: effectPlayer.displayName
      })
      const choice = createChoice({
        copiedByFirstEffect,
        effectPlayer,
        effectScheme,
        type: 'deck',
        threat
      })
      playState.game.choices.push(choice)
    }
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
