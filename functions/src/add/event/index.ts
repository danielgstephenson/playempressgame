import createEvent from '../../create/event'
import { EventContainer, HistoryEvent } from '../../types'

export default function addEvent (event: EventContainer, message: string): HistoryEvent {
  const created = createEvent(message)
  event.events.push(created)
  return created
}
