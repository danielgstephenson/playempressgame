import { deleteField } from 'firelord'

export const END_AUCTION = {
  withdrawn: false,
  bid: 0,
  auctionReady: false,
  lastBidder: false
}

export const END_AUCTION_PLAYER = {
  ...END_AUCTION,
  playScheme: deleteField(),
  trashScheme: deleteField()
}

export const PLAYER_CHOOSE_MESSAGE = 'Choose one scheme from your hand to play and another to trash.'
export const OBSERVER_CHOOSE_MESSAGE = 'Everyone chooses one scheme from their hand to play and another to trash.'
