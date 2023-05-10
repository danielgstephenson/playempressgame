import guardSchemeData from '../guard/schemeData'
import { Scheme } from '../types'
import createId from './id'

export default function createScheme (rank: number): Scheme {
  const data = guardSchemeData(rank)
  return {
    id: createId(),
    ...data
  }
}
