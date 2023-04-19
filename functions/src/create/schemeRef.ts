import { SchemeRef } from '../types'
import createId from './id'

export default function createSchemeRef (rank: number): SchemeRef {
  return { id: createId(), rank }
}
