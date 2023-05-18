import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps, Scheme } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import addEventsEverywhere from '../../add/events/everywhere'
import guardSchemeData from '../../guard/schemeData'
import guardDefined from '../../guard/defined'
import earn from '../earn'
import isGreen from '../../is/green'
import addLowestRankPlaySchemeEvents from '../../add/events/scheme/play/rank/lowest'

export default function effectsSeven ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if the left two timeline schemes are the same color, ${effectPlayer.displayName} earns the higher rank.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, if the left two timeline schemes are the same color, you earn the higher rank.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })

  const leftTwo = playState.game.timeline.slice(0, 2)
  function isSame (): false | Scheme {
    if (leftTwo.length === 0) {
      addEventsEverywhere({
        privateEvent: firstPrivateEvent,
        publicEvents: firstPublicChildren,
        message: 'The timeline is empty.'
      })
      return false
    }
    if (leftTwo.length === 1) {
      addEventsEverywhere({
        privateEvent: firstPrivateEvent,
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
      privateEvent: firstPrivateEvent,
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
        playEvents: twoEvents,
        message: higherMessage
      })
    }
    return second
  }
  const same = isSame()
  const leftBonus = same === false ? 0 : same.rank
  earn({
    amount: leftBonus,
    player: effectPlayer,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, if the lowest rank scheme in play is green, ${effectPlayer.displayName} earns 10 gold.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, if the lowest rank scheme in play is green, you earn 10 gold.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addLowestRankPlaySchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  const green = isGreen(scheme)
  if (green) {
    addEventsEverywhere({
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren,
      message: `${scheme.rank} is green, so you earn 10 gold.`
    })
    earn({
      amount: 10,
      player: effectPlayer,
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren
    })
  } else {
    addEventsEverywhere({
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren,
      message: `${scheme.rank} is not green.`
    })
  }
  return playState
}
