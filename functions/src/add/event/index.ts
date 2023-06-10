import createEvent from '../../create/event'
import { EventContainer, HistoryEvent } from '../../types'

export default function addEvent (event: EventContainer, message: string, children: HistoryEvent[] = []): HistoryEvent {
  const created = createEvent(message)
  created.events.push(...children)
  event.events.push(created)
  return created
}
