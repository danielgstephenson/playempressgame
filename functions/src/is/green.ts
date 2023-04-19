import { SchemeData } from '../types'

export default function isGreen (scheme?: SchemeData): boolean {
  return scheme?.color === 'Green'
}
