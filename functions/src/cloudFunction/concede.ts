import createCloudFunction from '../create/cloudFunction'
import { AuctionProps } from '../types'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion, increment } from 'firelord'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import getGrammar from '../get/grammar'
import { playersRef } from '../db'
import { END_AUCTION, END_AUCTION_PLAYER } from '../constants'

const concede = createCloudFunction<AuctionProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayer,
    currentPlayerRef
  } = await guardAuctionUnready({
    gameId,
    transaction,
    context
  })
  console.info(`Readying ${currentPlayer.id} for imprisonment...`)
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  if (highestUntiedProfile == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'There is no highest untied bidder.'
    )
  }
  if (highestUntiedProfile.userId === currentPlayer.userId) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are the highest untied bidder.'
    )
  }
  const privateReadyEvent = createEvent('You are ready to concede the auction.')
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready to concede the auction.`)
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
    updateAuctionWaiting({
      currentGame,
      currentPlayer,
      privateEvent: privateReadyEvent,
      publicEvent: publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} is ready to concede!`)
    return
  }
  const leftmost = currentGame.timeline[0]
  const endMessage = 'Everyone is ready to buy, so'
  const { spelled } = getGrammar(highestUntiedProfile.bid)
  const buyerEndSuffix = leftmost == null
    ? 'the auction ends'
    : `you pay ${spelled} gold and take ${leftmost.rank} into your tableau`
  const buyerEndEvent = createEvent(`${endMessage} ${buyerEndSuffix}.`)
  const publicEndSuffix = leftmost == null
    ? 'the auction ends'
    : `${highestUntiedProfile.displayName} pays ${spelled} gold and takes ${leftmost.rank} into their tableau`
  const publicEndEvent = createEvent(`${endMessage} ${publicEndSuffix}.`)
  const buyerPlayerId = `${highestUntiedProfile.userId}_${gameId}`
  const buyerRef = playersRef.doc(buyerPlayerId)
  transaction.update(buyerRef, {
    gold: increment(-highestUntiedProfile.bid),
    events: arrayUnion(publicReadyEvent, buyerEndEvent),
    ...END_AUCTION_PLAYER
  })
  transaction.update(currentPlayerRef, {
    events: arrayUnion(privateReadyEvent, publicEndEvent),
    ...END_AUCTION_PLAYER
  })
  const profiles = currentGame.profiles.map(profile => {
    const buyerChanges = profile.userId === highestUntiedProfile.userId
      ? { gold: profile.gold - highestUntiedProfile.bid }
      : {}
    return {
      ...profile,
      ...END_AUCTION,
      ...buyerChanges
    }
  })
  transaction.update(currentGameRef, {
    profiles,
    events: arrayUnion(publicReadyEvent, publicEndEvent)
  })
  currentGame.profiles.forEach(profile => {
    if (
      profile.userId === currentPlayer.userId ||
      profile.userId === highestUntiedProfile.userId
    ) {
      return
    }
    const playerId = `${profile.userId}_${currentGame.id}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, {
      events: arrayUnion(publicReadyEvent, publicEndEvent),
      ...END_AUCTION_PLAYER
    })
  })
  console.info(`${currentUid} conceded!`)
})
export default concede
