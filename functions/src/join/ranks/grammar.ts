import joinRanks from '.'
import { GetJoinedRanksGrammar, Scheme } from '../../types'
import getGrammar from '../../get/grammar'

export default function joinRanksGrammar (
  schemes: Scheme[], singular?: string, plural?: string
): GetJoinedRanksGrammar {
  const grammar = getGrammar(schemes.length, singular, plural)
  const joinedRanks = joinRanks(schemes)
  const joinedCount = `${grammar.count}, ${joinedRanks}`
  const joinedToBe = `${joinedRanks} ${grammar.toBe}`
  return { grammar, joinedCount, joinedRanks, joinedToBe }
}
