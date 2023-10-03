import getGrammar from '../get/grammar'
import { BuySuffixes } from '../types'

export default function createBuySuffixes ({
  bid,
  rank,
  name
}: {
  bid: number
  rank?: number | undefined
  name: string
}): BuySuffixes {
  const { spelled } = getGrammar(bid)
  const buyerEndSuffix = rank == null
    ? ''
    : ` and take ${rank} into play`
  const buyer = `you pay ${spelled}${buyerEndSuffix}`
  const loserEndSuffix = rank == null
    ? ''
    : ` and takes ${rank} into play`
  const loser = `${name} pays ${spelled}${loserEndSuffix}`
  return {
    buyer,
    loser
  }
}
