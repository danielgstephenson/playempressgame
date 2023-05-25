import addEventsEverywhere from './add/events/everywhere'
import guardProfile from './guard/profile'
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
  addEventsEverywhere({
    possessive: false,
    suffix,
    displayName: player.displayName,
    privateEvent,
    publicEvents
  })
  const profile = guardProfile(playState, player.userId)
  player.gold += earnedGold
  player.silver += remainder
  profile.gold += earnedGold
  profile.silver += remainder
}
