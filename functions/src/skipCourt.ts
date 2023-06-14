import addTargetEvents from './add/events/target'
import buy from './buy'
import carryOutFourteen from './carryOut/fourteen'
import { BuyerLoserMessages, PlayState } from './types'

export default function skipCourt ({
  bid,
  buyerId,
  buyerName,
  playState,
  ...buyerLoserMessages
}: {
  bid: number
  buyerId: string
  buyerName: string
  playState: PlayState
} & BuyerLoserMessages): void {
  buy({
    bid,
    buyerId,
    ...buyerLoserMessages,
    name: buyerName,
    playState
  })
  const buyerCourtMessage = 'There are no schemes in the court for you to take.'
  const loserCourtMessage = `There are no schemes in the court for ${buyerName} to take.`
  addTargetEvents({
    playState,
    message: loserCourtMessage,
    targetMessages: {
      [buyerId]: buyerCourtMessage
    }
  })
  carryOutFourteen({
    playState
  })
}
