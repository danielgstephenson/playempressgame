import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import earn from '../earn'
import joinRanksGrammar from '../join/ranks/grammar'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsNineteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'If your reserve is empty, you earn 30 gold.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s reserve is empty, they earn 30 gold.`)
  const reserveEmpty = effectPlayer.reserve.length === 0
  if (reserveEmpty) {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s reserve is empty.`)
    addEvent(firstPrivateChild, 'Your reserve is empty.')
  } else {
    const { joinedCount } = joinRanksGrammar(effectPlayer.reserve)
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s reserve has ${joinedCount}.`)
    addEvent(firstPrivateChild, `Your reserve has ${joinedCount}.`)
  }
  if (reserveEmpty) {
    earn({
      amount: 30,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  } else {
    const secondPrivateChild = addEvent(privateEvent, 'Otherwise, you earn 5 gold for each scheme in your reserve.')
    const secondPublicChildren = addPublicEvent(publicEvents, `Otherwise, ${effectPlayer.displayName} earns 5 gold for each scheme in their reserve.`)
    const { joinedCount } = joinRanksGrammar(effectPlayer.reserve)
    addPublicEvent(secondPublicChildren, `${effectPlayer.displayName}'s reserve has ${joinedCount}.`)
    addEvent(secondPrivateChild, `Your reserve has ${joinedCount}.`)
    if (effectPlayer.reserve.length > 0) {
      earn({
        amount: effectPlayer.reserve.length * 5,
        player: effectPlayer,
        playState,
        privateEvent: secondPrivateChild,
        publicEvents: secondPublicChildren
      })
    }
  }
  return playState
}
