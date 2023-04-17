import guardDefined from '../guard/defined'

export default function getTop <Scheme> (schemes: Scheme[]): Scheme | undefined {
  if (schemes.length === 0) {
    return undefined
  }
  const topSlice = schemes.slice(-1)
  const topScheme = guardDefined(topSlice[0], 'Top scheme')
  return topScheme
}
