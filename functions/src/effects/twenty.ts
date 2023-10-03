import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addLastReserveSchemeEvents from '../add/events/scheme/lastReserve'
import earn from '../earn'
import isYellow from '../is/yellow'
import summon from '../summon'
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
  const firstPrivateChild = addEvent(privateEvent, 'First, earn twice your last reserve\'s rank.')
  const firstPublicChildren = addPublicEvent(
    publicEvents,
    `First, ${effectPlayer.displayName} earns twice their last reserve's rank.`
  )
  const scheme = addLastReserveSchemeEvents({
    reserve: effectPlayer.reserve,
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, if your last reserve is not yellow, it is summoned to the court.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if ${effectPlayer.displayName}'s last reserve is not yellow, it is summoned to the court.`)
  const lastReserve = addLastReserveSchemeEvents({
    reserve: effectPlayer.reserve,
    displayName: effectPlayer.displayName,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  if (lastReserve == null) {
    addEventsEverywhere({
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      suffix: 'reserve is empty',
      displayName: effectPlayer.displayName
    })
  } else if (isYellow(lastReserve)) {
    addEventsEverywhere({
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      suffix: `last reserve, ${lastReserve.rank}, is yellow`,
      displayName: effectPlayer.displayName
    })
  } else {
    addEventsEverywhere({
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      suffix: `last reserve, ${lastReserve.rank}, is summoned to the court`,
      displayName: effectPlayer.displayName
    })
    effectPlayer.reserve.pop()
    summon({ court: playState.game.court, scheme: lastReserve })
  }
  return playState
}
