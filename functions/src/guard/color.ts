import { SchemeColor } from '../types'

export default function guardColor (color: string): SchemeColor {
  if (color === 'Green') return 'Green'
  if (color === 'Yellow') return 'Yellow'
  if (color === 'Red') return 'Red'
  throw new Error(`Invalid color: ${color}`)
}
