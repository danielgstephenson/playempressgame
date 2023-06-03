import createCloudFunction from '../create/cloudFunction'
import { GameProps } from '../types'
import guardString from '../guard/string'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion, increment } from 'firelord'
import updateImprison from '../update/imprison'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import getGrammar from '../get/grammar'
import { END_AUCTION } from '../constants'
import { playersRef } from '../db'

const withdraw = createCloudFunction<GameProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayer,
    currentPlayerRef
  } = await guardCurrentBidding({
    gameId,
    transaction,
    context
  })
  console.info(`${currentPlayer.id} withdrawing...`)
  const tiers = currentGame.profiles.filter(profile => profile.bid === currentPlayer.bid)
  if (tiers.length < 2) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not tied.'
    )
  }
  if (currentPlayer.lastBidder) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are the last bidder.'
    )
  }
  const privateReadyEvent = createEvent('You withdraw.')
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} withdrew.`)
  const unwithdrawnProfiles = currentGame.profiles.filter(profile => !profile.withdrawn)
  const auctionWaiting = unwithdrawnProfiles.length > 2
  if (auctionWaiting) {
    transaction.update(currentPlayerRef, {
      bid: 0,
      events: arrayUnion(privateReadyEvent),
      withdrawn: true,
      auctionReady: true
    })
    const profiles = currentGame.profiles.map(profile => {
      if (profile.userId === currentUid) {
        return { ...profile, auctionReady: true, bid: 0, withdrawn: true }
      }
      return { ...profile, auctionReady: profile.withdrawn }
    })
    transaction.update(currentGameRef, {
      profiles,
      events: arrayUnion(publicReadyEvent)
    })
    currentGame.profiles.forEach(profile => {
      if (
        profile.userId === currentPlayer.userId
      ) {
        return
      }
      const playerId = `${profile.userId}_${currentGame.id}`
      const playerRef = playersRef.doc(playerId)
      const readyUpdate = profile.withdrawn ? {} : { auctionReady: false }
      transaction.update(playerRef, {
        events: arrayUnion(publicReadyEvent),
        ...readyUpdate
      })
    })
    console.info(`${currentUid} is ready to withdraw!`)
    return
  }
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  if (highestUntiedProfile == null) {
    updateImprison({
      currentGame,
      currentPlayer,
      privateReadyEvent,
      publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} withdrew!`)
    return
  }
  const leftmost = currentGame.timeline[0]
  const endMessage = 'Everyone is ready to buy, so'
  const { spelled } = getGrammar(currentPlayer.bid)
  const buyerEndSuffix = leftmost == null
    ? 'the auction ends'
    : `you pay ${spelled} gold and take ${leftmost.rank} into your tableau`
  const buyerEndEvent = createEvent(`${endMessage} ${buyerEndSuffix}.`)
  const publicEndSuffix = leftmost == null
    ? 'the auction ends'
    : `${currentPlayer.displayName} pays ${spelled} gold and takes ${leftmost.rank} into their tableau`
  const publicEndEvent = createEvent(`${endMessage} ${publicEndSuffix}.`)
  const buyerPlayerId = `${highestUntiedProfile.userId}_${gameId}`
  const buyerRef = playersRef.doc(buyerPlayerId)
  transaction.update(buyerRef, {
    gold: increment(-highestUntiedProfile.bid),
    events: arrayUnion(publicReadyEvent, buyerEndEvent),
    ...END_AUCTION
  })
  transaction.update(currentPlayerRef, {
    events: arrayUnion(privateReadyEvent, publicEndEvent),
    ...END_AUCTION
  })
  const profiles = currentGame.profiles.map(profile => {
    const { playScheme, ...rest } = profile
    const buyerChanges = profile.userId === highestUntiedProfile.userId
      ? { gold: profile.gold - highestUntiedProfile.bid }
      : {}
    return {
      ...rest,
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
      ...END_AUCTION
    })
  })
  console.info(`${currentUid} withdrew!`)
})
export default withdraw
