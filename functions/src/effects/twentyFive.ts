import revive from '../revive'
import draw from '../draw'
import addPublicEvent from '../add/event/public'
import { PlayState, SchemeEffectProps } from '../types'
import addEvent from '../add/event'
import joinRanks from '../join/ranks'

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
  const secondPrivateChild = addEvent(privateEvent, 'Second, if your discard is empty, draw 5.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s discard is empty, draw 5.`)
  const joinedRanks = joinRanks(effectPlayer.discard)
  addEvent(secondPrivateChild, `Your discard is ${joinedRanks}.`)
  if (effectPlayer.discard.length === 0) {
    addPublicEvent(secondPublicChildren, `${effectPlayer.displayName}'s discard is empty.`)
    draw({
      depth: 5,
      playState,
      player: effectPlayer,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
  } else {
    addPublicEvent(secondPublicChildren, `${effectPlayer.displayName}'s discard is not empty.`)
  }
  return playState
}
