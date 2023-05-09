import createEvent from '../create/event'
import { HistoryEvent, Player, Result } from '../types'
import guardPlayHandScheme from './playHandScheme'
import guardTime from './time'

export default function guardTimeEvent ({
  player,
  privateId
}: {
  player: Result<Player>
  privateId?: string
}): HistoryEvent {
  const playScheme = guardPlayHandScheme(player)
  const time = guardTime(playScheme.rank)
  const displayName = player.id === privateId ? 'You' : player.displayName
  const message = `${displayName} played scheme ${playScheme.rank} with ${time} time.`
  const event = createEvent(message)
  return event
}
