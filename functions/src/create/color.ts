import { green, red, yellow } from '../db'
import { SchemeColor } from '../types'

export default function createColor (rank: number): SchemeColor {
  const isGreen = green.includes(rank)
  if (isGreen) {
    return 'green'
  }
  const isRed = red.includes(rank)
  if (isRed) {
    return 'red'
  }
  const isYellow = yellow.includes(rank)
  if (isYellow) {
    return 'yellow'
  }
  throw new Error(`No color for rank ${rank}`)
}
