import { schemeData } from '../db'
import { SchemeData } from '../types'

export default function guardSchemeData (rank: number): SchemeData {
  const data = schemeData[rank]
  if (data == null) {
    throw new Error(`No scheme data found for rank ${rank}`)
  }
  return data
}
