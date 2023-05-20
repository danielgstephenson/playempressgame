import getJoinedRanks from '.'
import { GetJoinedRanksGrammar, Scheme } from '../../../types'
import getGrammar from '../../grammar'

export default function getJoinedRanksGrammar (schemes: Scheme[]): GetJoinedRanksGrammar {
  const grammar = getGrammar(schemes.length)
  const joinedRanks = getJoinedRanks(schemes)
  const joinedCount = `${grammar.count}, ${joinedRanks}`
  return { grammar, joinedRanks, joinedCount }
}
