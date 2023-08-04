import { Identified, Scheme } from '../types'

export default function returnFromTableau ({ active, current, gameDungeon, twelve }: {
  active: Identified
  current: Scheme[]
  gameDungeon: Scheme[]
  twelve: boolean
}): Scheme[] {
  return current.filter((scheme) => {
    if (scheme.id === active.id) {
      return false
    }
    const fromDungeon = gameDungeon.some((dungeonScheme) => dungeonScheme.id === scheme.id)
    if (!twelve && fromDungeon) {
      return false
    }
    return true
  })
}
