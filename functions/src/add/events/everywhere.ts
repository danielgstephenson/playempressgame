import { HistoryEvent, PublicEvents, PlayEvents } from '../../types'
import addEvent from '../event'
import addPublicEvent from '../event/public'

export default function addEventsEverywhere ({
  possessive = true,
  displayName,
  message,
  privateEvent,
  privateMessage,
  privateSuffix,
  playEvents,
  publicEvents,
  publicMessage,
  publicSuffix,
  suffix
}: {
  possessive?: boolean
  privateSuffix?: string
  publicSuffix?: string
  suffix?: string
} & ({
  playEvents?: undefined
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
} | {
  playEvents: PlayEvents
  privateEvent?: undefined
  publicEvents?: undefined
}) & ({
  displayName?: undefined
  message?: undefined
  privateMessage: string
  publicMessage: string
} | {
  displayName?: undefined
  message: string
  privateMessage?: undefined
  publicMessage?: undefined
} | {
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
    const publicPrefix = possessive ? `${displayName}'s` : displayName
    const publicMessage = `${publicPrefix} ${publicSuffix ?? suffix}.`
    const addedPublic = addPublicEvent(publicProp, publicMessage)
    const privatePrefix = possessive ? 'Your' : 'You'
    const privateMessage = `${privatePrefix} ${privateSuffix ?? suffix}.`
    const addedPrivate = addEvent(privateProp, privateMessage)
    return { privateEvent: addedPrivate, publicEvents: addedPublic }
  }
}
