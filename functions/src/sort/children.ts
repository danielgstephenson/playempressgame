import { PlayerEvent } from '../types'
import playerSort from './player'

export default function sortChildren (event: PlayerEvent): PlayerEvent {
  playerSort({
    events: event.children,
    playerId: event.playerId
  })
  return event
}
