import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addLastReserveSchemeEvents from '../add/events/scheme/lastReserve'
import addLastReserveYellowEvents from '../add/events/scheme/lastReserve/yellow'
import earn from '../earn'
import joinRanksGrammar from '../join/ranks/grammar'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsEighteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if your last reserve is yellow, you earn twice its rank.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s last reserve is yellow, they earn twice its rank.`)
  const scheme = addLastReserveYellowEvents({
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
  const secondPrivateChild = addEvent(privateEvent, 'Second, if you took gold, you move your last reserve to the start.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if you took gold, ${effectPlayer.displayName} moves their last reserve to the start.`)
  if (scheme == null) {
    addEventsEverywhere({
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren,
      privateMessage: 'You did not take gold.',
      publicMessage: `${effectPlayer.displayName} did not take gold.`
    })
  } else {
    const lastReserve = addLastReserveSchemeEvents({
      reserve: effectPlayer.reserve,
      displayName: effectPlayer.displayName,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
    if (lastReserve != null) {
      const reserveBeforeJoined = joinRanksGrammar(effectPlayer.reserve)
      const reserveBeforeMessage = `Your reserve was ${reserveBeforeJoined.joinedRanks}.`
      effectPlayer.reserve.unshift(lastReserve)
      effectPlayer.reserve.pop()
      const reserveAfterJoined = joinRanksGrammar(effectPlayer.reserve)
      const reserveAfterMessage = `Your reserve becomes ${reserveAfterJoined.joinedRanks}.`
      const { privateEvent } = addEventsEverywhere({
        privateEvent: secondPrivateChild,
        publicEvents: secondPublicChildren,
        publicMessage: `${effectPlayer.displayName} moves ${lastReserve.rank} to the start of their reserve.`,
        privateMessage: `You move ${lastReserve.rank} to the the start of your reserve.`
      })
      addEvent(privateEvent, reserveBeforeMessage)
      addEvent(privateEvent, reserveAfterMessage)
    }
  }
  return playState
}
