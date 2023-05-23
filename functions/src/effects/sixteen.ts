import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import createChoice from '../create/choice'
import earn from '../earn'
import getGrammar from '../get/grammar'
import getJoinedRanks from '../get/joined/ranks'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsSixteen ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if  ${effectPlayer.displayName} has 5 or less schemes in hand, they earn 25 gold.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, if you have 5 or less schemes in hand, earn 25 gold.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const less = effectPlayer.hand.length < 6
  const { count } = getGrammar(effectPlayer.hand.length)
  const joined = getJoinedRanks(effectPlayer.hand)
  const privateMessage = `You have ${count} in hand, ${joined}.`
  addEvent(firstPrivateEvent, privateMessage)
  const lessMessage = less ? '5 or less schemes' : 'more than 5 schemes'
  const publicMessage = `${effectPlayer.displayName} has ${lessMessage} in hand.`
  addPublicEvent(firstPublicChildren, publicMessage)
  const lessBonus = less ? 25 : 0
  earn({
    amount: lessBonus,
    player: effectPlayer,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName} took gold, they put 1 scheme from their hand on their deck.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, if you took gold, put 1 scheme from your hand on your deck.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  if (less) {
    addEventsEverywhere({
      possessive: false,
      suffix: 'just took 25 gold',
      privateEvent: secondPrivateEvent,
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
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren,
      displayName: effectPlayer.displayName
    })
  }
  return playState
}
