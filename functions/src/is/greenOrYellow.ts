import { SchemeData } from '../types'
import isGreen from './green'
import isYellow from './yellow'

export default function isGreenOrYellow (scheme?: SchemeData): boolean {
  return isGreen(scheme) || isYellow(scheme)
}
