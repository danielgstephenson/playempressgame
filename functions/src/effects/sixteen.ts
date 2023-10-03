import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import createChoice from '../create/choice'
import earn from '../earn'
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
  const firstPrivateChild = addEvent(privateEvent, 'First, earn twenty five gold.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if  ${effectPlayer.displayName} earns twenty five gold.`)
  earn({
    amount: 25,
    player: effectPlayer,
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  const secondPrivateChild = addEvent(privateEvent, 'Second, if your reserve is not empty, put one scheme from your hand to the left of your last reserve.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s reserve is not empty, they put one scheme from their hand to the left of their last reserve.`)
  if (effectPlayer.reserve.length > 0) {
    const justMessage = 'reserve is not empty'
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
        type: 'reserve',
        threat
      })
      playState.game.choices.push(choice)
    }
  } else {
    addEventsEverywhere({
      possessive: true,
      suffix: 'reserve is empty',
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      displayName: effectPlayer.displayName
    })
  }
  return playState
}
