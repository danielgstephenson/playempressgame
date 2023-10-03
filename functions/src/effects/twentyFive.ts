import revive from '../revive'
import draw from '../draw'
import addPublicEvent from '../add/event/public'
import { PlayState, SchemeEffectProps } from '../types'
import addEvent from '../add/event'
import joinRanksGrammar from '../join/ranks/grammar'

export default function effectsTwentyFive ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if you have 50 or less gold, revive 5.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName} has 50 or less gold, they revive 5.`)
  addEvent(firstPrivateChild, `You have ${effectPlayer.gold} gold.`)
  addPublicEvent(firstPublicChildren, `${effectPlayer.displayName} has ${effectPlayer.gold} gold.`)
  if (effectPlayer.gold <= 50) {
    revive({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, if your reserve has 5 or less schemes, draw 5.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s reserve has 5 or less schemes, draw 5.`)
  const { joinedRanks, joinedCount } = joinRanksGrammar(effectPlayer.reserve)
  addEvent(secondPrivateChild, `Your reserve is ${joinedRanks}.`)
  addPublicEvent(secondPublicChildren, `${effectPlayer.displayName}'s reserve has ${joinedCount}.`)
  if (effectPlayer.reserve.length > 5) {
    draw({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
