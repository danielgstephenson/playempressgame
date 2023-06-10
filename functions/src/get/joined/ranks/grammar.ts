import getJoinedRanks from '.'
import { GetJoinedRanksGrammar, Scheme } from '../../../types'
import getGrammar from '../../grammar'

export default function getJoinedRanksGrammar (
  schemes: Scheme[], singular?: string, plural?: string
): GetJoinedRanksGrammar {
  const grammar = getGrammar(schemes.length, singular, plural)
  const joinedRanks = getJoinedRanks(schemes)
  const joinedCount = `${grammar.count}, ${joinedRanks}`
  const joinedToBe = `${joinedRanks} ${grammar.toBe}`
  return { grammar, joinedCount, joinedRanks, joinedToBe }
}
