import { effects } from '../db'
import guardDefined from './defined'
import { SchemeEffect } from '../types'

export default function guardEffect (rank: number): SchemeEffect {
  const effect = effects[rank]
  const label = `Invalid effect rank: ${rank}`
  return guardDefined(effect, label)
}
