import createEvent from '../create/event'
import { HistoryEvent, Player, Result } from '../types'
import guardPlayScheme from './playScheme'
import guardTime from './time'

export default function guardTimeEvent ({
  player,
  privateId
}: {
  player: Result<Player>
  privateId?: string
}): HistoryEvent {
  const playScheme = guardPlayScheme(player)
  const time = guardTime(playScheme.rank)
  const displayName = player.id === privateId ? 'You' : player.displayName
  const message = `${displayName} played scheme ${playScheme.rank} with ${time} time.`
  const event = createEvent(message)
  event.playerId = player.id
  return event
}
