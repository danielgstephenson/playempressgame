import { Scheme, HistoryEvent } from '../../types'
import createEvent from '.'

export default function createColorsEvent ({ message, schemes }: {
  message: string
  schemes: Scheme[]
}): HistoryEvent {
  const event = createEvent(message)
  schemes.forEach(scheme => {
    const schemeEvent = createEvent(`${scheme.rank} is ${scheme.color}.`)
    event.events.push(schemeEvent)
  })
  return event
}
