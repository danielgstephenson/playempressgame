import addBuyEvents from './add/events/buy'
import guardDefined from './guard/defined'
import { PlayState, BuyerLoserMessages } from './types'

export default function buy ({
  bid,
  buyerId,
  name,
  playState,
  ...buyerLoserMessages
}: {
  bid: number
  buyerId: string
  name: string
  playState: PlayState
} & BuyerLoserMessages): void {
  const leftmost = playState.game.timeline.shift()
  addBuyEvents({
    bid,
    buyerId,
    ...buyerLoserMessages,
    name,
    playState,
    rank: leftmost?.rank
  })
  playState.players.forEach(player => {
    player.auctionReady = true
  })
  const found = playState.players.find(player => player.id === buyerId)
  const buyer = guardDefined(found, 'Buyer')
  if (leftmost != null) {
    buyer.tableau.push(leftmost)
  }
  buyer.gold -= bid
  buyer.auctionReady = true
}
