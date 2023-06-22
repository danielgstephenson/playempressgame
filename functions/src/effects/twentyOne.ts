import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addLeftmostTimelineSchemeEvents from '../add/events/scheme/timeline/leftmost'
import earn from '../earn'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsTwentyOne ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, pay five times the leftmost timeline scheme\'s time in gold.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} pays five times the leftmost timeline scheme's time in gold.`)
  const { scheme } = addLeftmostTimelineSchemeEvents({
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren,
    templateCallback: (scheme) => {
      const { time } = scheme
      return `with ${time} time.`
    }
  })
  if (scheme != null && scheme.time > 0) {
    const leftFive = scheme.time * 5
    const silverCost = Math.min(leftFive, effectPlayer.silver)
    const leftSilverRemaining = leftFive - silverCost
    const leftGold = Math.ceil(leftSilverRemaining / 5) * 5
    const goldCost = Math.min(leftGold, effectPlayer.gold)
    if (silverCost > 0) {
      const allSilver = silverCost === effectPlayer.silver
      const publicMessage = allSilver
        ? `${effectPlayer.displayName} pays ${silverCost} silver, all they have.`
        : `${effectPlayer.displayName} pays ${silverCost} silver.`
      const privateMessage = allSilver
        ? `You pay ${silverCost} silver, all you have.`
        : `You pay ${silverCost} silver.`
      const { privateEvent, publicEvents } = addEventsEverywhere({
        publicEvents: firstPublicChildren,
        privateEvent: firstPrivateChild,
        publicMessage,
        privateMessage
      })
      addEvent(privateEvent, `You had ${effectPlayer.silver} silver.`)
      const publicSilverBeforeMessage = `${effectPlayer.displayName} had ${effectPlayer.silver} silver.`
      addEvent(publicEvents.observerEvent, publicSilverBeforeMessage)
      publicEvents.otherPlayerEvents.forEach((publicEvent) => {
        addEvent(publicEvent, `${effectPlayer.displayName} had ${effectPlayer.silver} silver.`)
      })
      effectPlayer.silver -= silverCost
      if (!allSilver) {
        addEvent(privateEvent, `You then have ${effectPlayer.silver} silver.`)
        const publicSilverAfterMessage = `${effectPlayer.displayName} then has ${effectPlayer.silver} silver.`
        addEvent(publicEvents.observerEvent, publicSilverAfterMessage)
        publicEvents.otherPlayerEvents.forEach((publicEvent) => {
          addEvent(publicEvent, publicSilverAfterMessage)
        })
      }
    }
    if (goldCost > 0) {
      const allGold = goldCost === effectPlayer.gold
      const publicMessage = allGold
        ? `${effectPlayer.displayName} pays ${goldCost} gold, all they have.`
        : `${effectPlayer.displayName} pays ${goldCost} gold.`
      const privateMessage = allGold
        ? `You pay ${goldCost} gold, all you have.`
        : `You pay ${goldCost} gold.`
      const { privateEvent, publicEvents: { observerEvent, otherPlayerEvents } } = addEventsEverywhere({
        publicEvents: firstPublicChildren,
        privateEvent: firstPrivateChild,
        publicMessage,
        privateMessage
      })
      addEvent(privateEvent, `You had ${effectPlayer.gold} gold.`)
      const publicGoldBeforeMessage = `${effectPlayer.displayName} had ${effectPlayer.gold} gold.`
      addEvent(observerEvent, publicGoldBeforeMessage)
      otherPlayerEvents.forEach((publicEvent) => {
        addEvent(publicEvent, publicGoldBeforeMessage)
      })
      effectPlayer.gold -= goldCost
      if (!allGold) {
        addEvent(privateEvent, `You then have ${effectPlayer.gold} gold.`)
        const publicGoldAfterMessage = `${effectPlayer.displayName} then has ${effectPlayer.gold} gold.`
        addEvent(observerEvent, publicGoldAfterMessage)
        otherPlayerEvents.forEach((publicEvent) => {
          addEvent(publicEvent, publicGoldAfterMessage)
        })
      }
    }
    const leftGoldRemaining = leftGold - goldCost
    const change = leftGoldRemaining === 0 ? goldCost - leftSilverRemaining : 0
    if (change > 0) {
      const publicMessage = `${effectPlayer.displayName} takes ${change} silver in change.`
      const privateMessage = `You take ${change} silver in change.`
      const { privateEvent, publicEvents: { observerEvent, otherPlayerEvents } } = addEventsEverywhere({
        publicEvents: firstPublicChildren,
        privateEvent: firstPrivateChild,
        publicMessage,
        privateMessage
      })
      addEvent(privateEvent, `You had ${effectPlayer.silver} silver.`)
      const publicSilverBeforeMessage = `${effectPlayer.displayName} had ${effectPlayer.silver} silver.`
      addEvent(observerEvent, publicSilverBeforeMessage)
      otherPlayerEvents.forEach((publicEvent) => {
        addEvent(publicEvent, publicSilverBeforeMessage)
      })
      effectPlayer.silver += change
      addEvent(privateEvent, `You then have ${effectPlayer.silver} silver.`)
      const publicSilverAfterMessage = `${effectPlayer.displayName} then has ${effectPlayer.silver} silver.`
      addEvent(observerEvent, publicSilverAfterMessage)
      otherPlayerEvents.forEach((publicEvent) => {
        addEvent(publicEvent, publicSilverAfterMessage)
      })
    }
  }
  const secondPrivateChild = addEvent(privateEvent, 'Second, earn twice the left timeline scheme\'s rank.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} earns twice the left timeline scheme's rank.`)
  if (scheme == null) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateChild,
      message: 'The timeline is empty.'
    })
  } else {
    earn({
      amount: scheme.rank * 2,
      player: effectPlayer,
      playState,
      privateEvent: secondPrivateChild,
      publicEvents: secondPublicChildren
    })
  }
  return playState
}
