import createEvent from '../create/event'
import { HistoryEvent } from '../types'

export default function addEvent (event: HistoryEvent, message: string): HistoryEvent {
  const created = createEvent(message)
  event.children.push(created)
  return event
}
