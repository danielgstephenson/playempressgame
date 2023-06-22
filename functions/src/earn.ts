import addEventsEverywhere from './add/events/everywhere'
import {
  HistoryEvent, PlayState, Player, PublicEvents, Result
} from './types'

export default function earn ({
  amount,
  player,
  playState,
  privateEvent,
  publicEvents
}: {
  amount: number
  player: Result<Player>
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): void {
  const remainder = amount % 5
  const earnedGold = amount - remainder
  const someGold = amount >= 5
  const someSilver = remainder > 0
  const amountMessage = someGold
    ? someSilver
      ? `${earnedGold} gold and ${remainder} silver`
      : `${earnedGold} gold`
    : someSilver
      ? `${remainder} silver`
      : '0'
  const suffix = `earn ${amountMessage}`
  const playEvents = addEventsEverywhere({
    possessive: false,
    suffix,
    displayName: player.displayName,
    privateEvent,
    publicEvents
  })
  if (earnedGold > 0) {
    addEventsEverywhere({
      playEvents,
      publicMessage: `${player.displayName} had ${player.gold} gold.`,
      privateMessage: `You had ${player.gold} gold.`
    })
    player.gold += earnedGold
    addEventsEverywhere({
      playEvents,
      publicMessage: `${player.displayName} then has ${player.gold} gold.`,
      privateMessage: `You then have ${player.gold} gold.`
    })
  }
  if (remainder > 0) {
    addEventsEverywhere({
      playEvents,
      publicMessage: `${player.displayName} had ${player.silver} silver.`,
      privateMessage: `You had ${player.silver} silver.`
    })
    player.silver += remainder
    addEventsEverywhere({
      playEvents,
      publicMessage: `${player.displayName} then has ${player.silver} silver.`,
      privateMessage: `You then have ${player.silver} silver.`
    })
  }
}
