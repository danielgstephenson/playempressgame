import { PlayerEvent } from '../types'
import guardDefined from './defined'

export default function guardPlayerEvent ({
  events,
  playerId,
  label
}: {
  events: PlayerEvent[]
  playerId: string
  label?: string
}): PlayerEvent {
  const found = events.find(event => event.playerId === playerId)
  const eventLabel = label == null ? 'Player event' : `${label} player event`
  const defined = guardDefined(found, eventLabel)
  return defined
}
