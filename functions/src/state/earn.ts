import addEventsEverywhere from '../add/events/everywhere'
import { HistoryEvent, Player, PublicEvents, Result } from '../types'

export default function earn ({
  amount,
  player,
  privateEvent,
  publicEvents
}: {
  amount: number
  player: Result<Player>
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
  const base = `earn ${amountMessage}`
  addEventsEverywhere({
    suffix: base,
    displayName: player.displayName,
    privateEvent,
    publicEvents
  })
  player.gold = player.gold + earnedGold
  player.silver = player.silver + remainder
}
