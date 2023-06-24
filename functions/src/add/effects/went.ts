import { HistoryEvent, PublicEvents } from '../../types'
import addEvent from '../event'

export default function addWentEvents ({
  after,
  before,
  name,
  privateEvent,
  publicEvents,
  type
}: {
  after: number
  before: number
  name: string
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  type: 'silver' | 'gold'
}): void {
  const wentMessage = `went from ${before} to ${after} ${type}.`
  addEvent(privateEvent, `You ${wentMessage}.`)
  const publicSilverAfterMessage = `${name} ${wentMessage}.`
  addEvent(publicEvents.observerEvent, publicSilverAfterMessage)
  publicEvents.otherPlayerEvents.forEach((publicEvent) => {
    addEvent(publicEvent, publicSilverAfterMessage)
  })
}
