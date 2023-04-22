import { Scheme, HistoryEvent } from '../types'
import createEvent from './event'

export default function createColorsEvent ({ message, schemes }: {
  message: string
  schemes: Scheme[]
}): HistoryEvent {
  const event = createEvent(message)
  schemes.forEach(scheme => {
    const event = createEvent(`${scheme.rank} is ${scheme.color}.`)
    event.children.push(event)
  })
  return event
}
