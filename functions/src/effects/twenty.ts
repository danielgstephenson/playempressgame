import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addTopDiscardSchemeEvents from '../add/events/scheme/topDiscard'
import earn from '../earn'
import isYellow from '../is/yellow'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsTwenty ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, earn twice your top discard scheme\'s rank.')
  const firstPublicChildren = addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} earns twice their top discard scheme's rank.`
  )
  const scheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank * 2,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, if your top discard scheme is not yellow, it is summoned to the court.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s top discard scheme is not yellow, it is summoned to the court.`)
  const topDiscardScheme = addTopDiscardSchemeEvents({
    discard: effectPlayer.discard,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  const topDiscardYellow = topDiscardScheme != null && !isYellow(topDiscardScheme)
  if (topDiscardYellow) {
    addEventsEverywhere({
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      suffix: `top discard scheme, ${topDiscardScheme.rank}, is summoned to the court`,
      displayName: effectPlayer.displayName
    })
    earn({
      amount: topDiscardScheme.rank,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  return playState
}