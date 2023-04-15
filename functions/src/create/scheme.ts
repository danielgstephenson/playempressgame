import { Scheme } from '../types'
import createColor from './color'
import { createId } from './id'

export function createScheme (rank: number): Scheme {
  const color = createColor(rank)
  return { id: createId(), rank, color }
}
