import { SchemeData } from '../types'

export default function isRed (scheme?: SchemeData): boolean {
  return scheme?.color === 'red'
}
