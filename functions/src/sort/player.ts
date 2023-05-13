import { HistoryEvent } from '../types'

export default function playerSort ({ events, playerId }: {
  events: HistoryEvent[]
  playerId: string
}): HistoryEvent[] {
  const sorted = events
    .sort((a, b) => a.playerId === playerId ? -1 : 1)
  return sorted
}
