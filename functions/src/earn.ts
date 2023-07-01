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
  const privateSuffix = `earn ${amountMessage}`
  const publicSuffix = `earn ${amountMessage}`
  const playEvents = addEventsEverywhere({
    possessive: false,
    displayName: player.displayName,
    privateEvent,
    publicEvents,
    publicSuffix,
    privateSuffix
  })
  if (earnedGold > 0) {
    const before = player.gold
    player.gold += earnedGold
    addEventsEverywhere({
      playEvents,
      publicMessage: `${player.displayName} went from ${before} gold to ${player.gold} gold.`,
      privateMessage: `You went from ${before} gold to ${player.gold} gold.`
    })
  }
  if (remainder > 0) {
    const before = player.silver
    player.silver += remainder
    addEventsEverywhere({
      playEvents,
      publicMessage: `${player.displayName} went from ${before} silver to ${player.silver} silver.`,
      privateMessage: `You went from ${before} silver to ${player.silver} silver.`
    })
  }
}
