import { HistoryEvent, PublicEvents, PlayEvents } from '../../types'
import addEvent from '../event'
import addPublicEvent from '../event/public'

export default function addEventsEverywhere ({
  suffix,
  displayName,
  message,
  privateEvent,
  privateMessage,
  playEvents,
  publicEvents,
  publicMessage
}: ({
  playEvents?: undefined
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
} | {
  playEvents: PlayEvents
  privateEvent?: undefined
  publicEvents?: undefined
}) & ({
  suffix?: undefined
  displayName?: undefined
  message?: undefined
  privateMessage: string
  publicMessage: string
} | {
  suffix?: undefined
  displayName?: undefined
  message: string
  privateMessage?: undefined
  publicMessage?: undefined
} | {
  suffix: string
  displayName: string
  message?: undefined
  privateMessage?: undefined
  publicMessage?: undefined
})): PlayEvents {
  const publicProp = playEvents == null ? publicEvents : playEvents.publicEvents
  const privateProp = playEvents == null ? privateEvent : playEvents.privateEvent
  if (message != null) {
    const addedPublic = addPublicEvent(publicProp, message)
    const addedPrivate = addEvent(privateProp, message)
    return { privateEvent: addedPrivate, publicEvents: addedPublic }
  } else if (privateMessage != null && publicMessage != null) {
    const addedPublic = addPublicEvent(publicProp, publicMessage)
    const addedPrivate = addEvent(privateProp, privateMessage)
    return { privateEvent: addedPrivate, publicEvents: addedPublic }
  } else {
    const publicMessage = `${displayName}'s ${suffix}.`
    const addedPublic = addPublicEvent(publicProp, publicMessage)
    const privateMessage = `Your ${suffix}.`
    const addedPrivate = addEvent(privateProp, privateMessage)
    return { privateEvent: addedPrivate, publicEvents: addedPublic }
  }
}
