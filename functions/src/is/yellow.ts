import { SchemeData } from '../types'

export default function isYellow (scheme?: SchemeData): boolean {
  return scheme?.color === 'Yellow'
}
