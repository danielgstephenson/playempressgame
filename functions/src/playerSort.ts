import { HistoryEvent, Player, Result } from './types'

export default function playerSort ({ events, player }: {
  events: HistoryEvent[]
  player: Result<Player>
}): HistoryEvent[] {
  const sorted = events
    .sort((a, b) => a.playerId === player.id ? -1 : 1)
  return sorted
}
