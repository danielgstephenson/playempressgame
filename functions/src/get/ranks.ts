import { SchemeRef } from '../types'
import getJoined from './joined'

export default function getRanks (schemes: SchemeRef[]): string {
  const ranks = schemes.map(scheme => scheme.rank)
  return getJoined(ranks)
}
