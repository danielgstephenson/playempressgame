import { Choice, Range } from '../types'

export default function getTimelineRange ({ choices, final, phase, timelineLength }: {
  choices: Choice[]
  final: boolean
  phase: string
  timelineLength: number
}): Range {
  if (final) return { minimum: 0, maximum: 0 }
  if (phase === 'play' && choices.length === 0) {
    const minimumRange = getTimelineRange({
      timelineLength: timelineLength - 1,
      phase: 'auction',
      final: false,
      choices
    })
    const maximumRange = getTimelineRange({
      timelineLength,
      phase: 'auction',
      final: false,
      choices
    })
    return {
      minimum: minimumRange.minimum,
      maximum: maximumRange.maximum
    }
  } else {
    if (timelineLength <= 1) {
      return { minimum: 1, maximum: 1 }
    } else if (timelineLength === 2) {
      return { minimum: 2, maximum: 2 }
    } else if (timelineLength === 3) {
      return { minimum: 2, maximum: 3 }
    } else if (timelineLength === 4) {
      return { minimum: 3, maximum: 4 }
    } else {
      return {
        minimum: Math.ceil(timelineLength / 2) + 1,
        maximum: timelineLength
      }
    }
  }
}
