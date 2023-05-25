import { HistoryEvent } from '../types'
import playerSort from './player'

export default function sortChildren ({
  event,
  playerId
}: {
  event: HistoryEvent
  playerId: string
}): void {
  playerSort({
    events: event.children,
    playerId
  })
}
