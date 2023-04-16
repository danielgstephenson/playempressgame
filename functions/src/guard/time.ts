import guardSchemeData from './schemeData'

export default function guardTime (rank: number): number {
  return guardSchemeData(rank).time
}
