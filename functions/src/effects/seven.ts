import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPlayerPublicEvents from '../add/events/player/public'
import addHighestPlayTimeEvents from '../add/events/scheme/play/time/highest'
import earn from '../earn'
import guardDefined from '../guard/defined'
import guardSchemeData from '../guard/schemeData'
import { PlayState, Scheme, SchemeEffectProps } from '../types'

export default function effectsSeven ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if the left two timeline schemes are the same color, you earn the higher rank.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if the left two timeline schemes are the same color, ${effectPlayer.displayName} earns the higher rank.`)
  const leftTwo = playState.game.timeline.slice(0, 2)
  function isSame (): false | Scheme {
    if (leftTwo.length === 0) {
      addEventsEverywhere({
        privateEvent: firstPrivateChild,
        publicEvents: firstPublicChildren,
        message: 'The timeline is empty.'
      })
      return false
    }
    if (leftTwo.length === 1) {
      addEventsEverywhere({
        privateEvent: firstPrivateChild,
        publicEvents: firstPublicChildren,
        message: 'The timeline has only one scheme.'
      })
      return false
    }
    const colors = leftTwo.map(scheme => guardSchemeData(scheme.rank).color)
    const same = colors.every(color => color === colors[0])
    const first = guardDefined(leftTwo[0], 'First timeline')
    const second = guardDefined(leftTwo[1], 'Second timeline')
    const twoMessage = same
      ? `The left two timeline schemes are ${first.color}.`
      : 'The left two timeline schemes are different colors.'
    const twoEvents = addEventsEverywhere({
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren,
      message: twoMessage
    })
    const firstMessage = `The first timeline scheme, ${first.rank}, is ${first.color}.`
    addEventsEverywhere({
      playEvents: twoEvents,
      message: firstMessage
    })
    const secondMessage = `The second timeline scheme, ${second.rank}, is ${second.color}.`
    addEventsEverywhere({
      playEvents: twoEvents,
      message: secondMessage
    })
    if (same) {
      const higherMessage = `The higher rank scheme is ${second.rank}.`
      addEventsEverywhere({
        message: higherMessage,
        privateEvent: firstPrivateChild,
        publicEvents: firstPublicChildren
      })
      return second
    }
    return false
  }
  const same = isSame()
  const leftBonus = same === false ? 0 : same.rank
  earn({
    amount: leftBonus,
    player: effectPlayer,
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  const secondPrivateChild = addEvent(privateEvent, 'Second, you earn the highest time in play in silver.')
  const secondPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `Second, ${effectPlayer.displayName} earns the highest time in play in silver.`
  })
  const { time } = addHighestPlayTimeEvents({
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  earn({
    amount: time,
    player: effectPlayer,
    playState,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
