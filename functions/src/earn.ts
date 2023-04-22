import createEvent from './create/event'
import { Earning, HistoryEvent } from './types'

export default function earn ({
  baseGold,
  baseSilver,
  bonus,
  condition = true,
  event,
  message,
  nonMessage,
  nonEvent
}: {
  baseGold: number
  baseSilver: number
  bonus?: number | undefined
  condition?: boolean
  event: HistoryEvent
  message?: string
} & ({
  nonEvent?: HistoryEvent
  nonMessage?: undefined
} | {
  nonEvent?: undefined
  nonMessage?: string
})): Earning {
  const base = { gold: baseGold, silver: baseSilver }
  if (!condition || bonus == null) {
    if (nonEvent != null) {
      event.children.push(nonEvent)
    } else if (nonMessage != null) {
      event.children.push(createEvent(nonMessage))
    }
    return base
  }
  if (message != null) {
    event.children.push(createEvent(message))
  }
  if (bonus === 0) {
    return base
  }
  const remainder = bonus % 5
  const earnedGold = bonus - remainder
  const someGold = bonus >= 5
  const someSilver = remainder > 0
  const bonusMessage = someGold
    ? someSilver
      ? `${earnedGold} gold and ${remainder} silver`
      : `${earnedGold} gold`
    : someSilver
      ? `${remainder} silver`
      : '0'

  event.children.push(createEvent(`You earn ${bonusMessage}.`))
  return {
    gold: baseGold + earnedGold,
    silver: baseSilver + remainder
  }
}
