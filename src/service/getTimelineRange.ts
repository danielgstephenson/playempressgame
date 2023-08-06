import { Range } from '../types'

export default function getTimelineRange ({ timelineLength, phase, final }: {
  timelineLength: number
  phase: string
  final: boolean
}): Range {
  if (final) return { minimum: 0, maximum: 0 }
  if (phase === 'play') {
    return {
      minimum: getTimelineRange({ timelineLength: timelineLength - 1, phase: 'auction', final: false }).minimum,
      maximum: getTimelineRange({ timelineLength, phase: 'auction', final: false }).maximum
    }
  }
  if (phase === 'auction') {
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
  throw new Error('Invalid phase')
}
