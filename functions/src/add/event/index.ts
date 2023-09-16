import createEvent from '../../create/event'
import { EventContainer, HistoryEvent } from '../../types'

export default function addEvent (event: EventContainer, message: string, children: HistoryEvent[] = [], roundEvent?: boolean): HistoryEvent {
  const created = createEvent(message, [], roundEvent)
  created.events.push(...children)
  event.events.push(created)
  return created
}
