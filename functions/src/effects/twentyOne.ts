import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import addLeftmostTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost'
import earn from '../earn'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsTwentyOne ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} pays five times the leftmost timeline scheme's time in gold.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: "First, pay five times the leftmost timeline scheme's time in gold.",
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addLeftmostTimelineSchemeEvents({
    playState,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren,
    templateCallback: (scheme) => {
      const { time } = scheme
      return `with ${time} time.`
    }
  })
  if (scheme != null && scheme.time > 0) {
    const leftFive = scheme.time * 5
    const silverCost = Math.min(leftFive, effectPlayer.silver)
    if (silverCost > 0) {
      const allSilver = silverCost === effectPlayer.silver
      const publicMessage = allSilver
        ? `${effectPlayer.displayName} pays ${silverCost} silver, all they have.`
        : `${effectPlayer.displayName} pays ${silverCost} silver.`
      const privateMessage = allSilver
        ? `You pay ${silverCost} silver, all you have.`
        : `You pay ${silverCost} silver.`
      addEventsEverywhere({
        publicEvents: firstPublicChildren,
        privateEvent: firstPrivateEvent,
        publicMessage,
        privateMessage
      })
      effectPlayer.silver -= silverCost
    }
    const leftSilverRemaining = leftFive - silverCost
    const leftGold = Math.ceil(leftSilverRemaining / 5) * 5
    const goldCost = Math.min(leftGold, effectPlayer.gold)
    if (goldCost > 0) {
      const allGold = goldCost === effectPlayer.gold
      const publicMessage = allGold
        ? `${effectPlayer.displayName} pays ${goldCost} gold, all they have.`
        : `${effectPlayer.displayName} pays ${goldCost} gold.`
      const privateMessage = allGold
        ? `You pay ${goldCost} gold, all you have.`
        : `You pay ${goldCost} gold.`
      addEventsEverywhere({
        publicEvents: firstPublicChildren,
        privateEvent: firstPrivateEvent,
        publicMessage,
        privateMessage
      })
      effectPlayer.gold -= goldCost
    }
    const leftGoldRemaining = leftGold - goldCost
    const change = leftGoldRemaining === 0 ? goldCost - leftSilverRemaining : 0
    if (change > 0) {
      const publicMessage = `${effectPlayer.displayName} takes ${change} silver in change.`
      const privateMessage = `You take ${change} silver in change.`
      addEventsEverywhere({
        publicEvents: firstPublicChildren,
        privateEvent: firstPrivateEvent,
        publicMessage,
        privateMessage
      })
      effectPlayer.silver += change
    }
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} earns twice the left timeline scheme's rank.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: "Second, you earn twice the left timeline scheme's rank.",
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  if (scheme == null) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateEvent,
      message: 'The timeline is empty.'
    })
  } else {
    earn({
      amount: scheme.rank * 2,
      player: effectPlayer,
      privateEvent: secondPrivateEvent,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
