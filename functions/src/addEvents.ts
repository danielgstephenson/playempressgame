import { createEvent } from './create/event'
import { HistoryEvent } from './types'

export default function addEvents (event: HistoryEvent, ...messages: string[]): void {
  const children = messages.map(message => createEvent(message))
  event.children.concat(children)
}
