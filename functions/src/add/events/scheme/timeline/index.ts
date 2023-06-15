import getGrammar from '../../../../get/grammar'
import joinRanks from '../../../../join/ranks'
import guardDefined from '../../../../guard/defined'
import { PlayEvents, HistoryEvent, PublicEvents, Scheme } from '../../../../types'
import addEventsEverywhere from '../../everywhere'

export default function addTimelineEvents ({
  playEvents,
  publicEvents,
  privateEvent,
  timeline
}: {
  timeline: Scheme[]
} & ({
  playEvents: PlayEvents
  publicEvents?: undefined
  privateEvent?: undefined
} | {
  playEvents?: undefined
  publicEvents: PublicEvents
  privateEvent: HistoryEvent
})): void {
  const publicProp = playEvents == null ? publicEvents : playEvents.publicEvents
  const privateProp = playEvents == null ? privateEvent : playEvents.privateEvent
  const joined = joinRanks(timeline)
  const { toBe: verb, noun } = getGrammar(timeline.length)
  addEventsEverywhere({
    publicEvents: publicProp,
    privateEvent: privateProp,
    message: `The timeline ${noun} ${verb} ${joined}.`
  })
  timeline.forEach(scheme => {
    const { rank } = guardDefined(scheme, 'Timeline scheme')
    const message = `${rank} is ${scheme.color}.`
    addEventsEverywhere({
      publicEvents: publicProp,
      privateEvent: privateProp,
      message
    })
  })
}
