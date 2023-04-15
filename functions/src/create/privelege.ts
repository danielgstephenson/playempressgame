import { createScheme } from './scheme'
import { Scheme } from '../types'

export default function takePrivelege (count: number): Scheme[] {
  const schemes = new Array(count).fill(0).map((_, i) => {
    return createScheme(1)
  })
  return schemes
}
