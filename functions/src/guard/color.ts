import { SchemeColor } from '../types'

export default function guardColor (color: string): SchemeColor {
  if (color === 'green') return 'green'
  if (color === 'yellow') return 'yellow'
  if (color === 'red') return 'red'
  throw new Error(`Invalid color: ${color}`)
}
