import createCloudFunction from '../create/cloudFunction'
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
import { GameProps } from '../types'
import getJoinedRanks from '../get/joined/ranks'
import addEvent from '../add/event'

const concede = createCloudFunction<GameProps>(async (props, context, transaction) => {
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
  const beforeTimeline = [...currentGame.timeline].reverse()
  const beforeJoined = getJoinedRanks(beforeTimeline)
  const beforeMessage = `The timeline was ${beforeJoined}.`
  const leftmost = currentGame.timeline.shift()
  const afterTimeline = [...currentGame.timeline].reverse()
  const afterJoined = getJoinedRanks(afterTimeline)
  const afterMessage = `The timeline becomes ${afterJoined}.`
  const endMessage = 'Everyone is ready, so'
  const { spelled } = getGrammar(highestUntiedProfile.bid)
  const buyerEndSuffix = leftmost == null
    ? 'the auction ends'
    : `you pay ${spelled} gold and take ${leftmost.rank} into your tableau`
  const buyerEndEvent = createEvent(`${endMessage} ${buyerEndSuffix}.`)
  addEvent(buyerEndEvent, beforeMessage)
  addEvent(buyerEndEvent, afterMessage)
  const publicEndSuffix = leftmost == null
    ? 'the auction ends'
    : `${highestUntiedProfile.displayName} pays ${spelled} gold and takes ${leftmost.rank} into their tableau`
  const publicEndEvent = createEvent(`${endMessage} ${publicEndSuffix}.`)
  addEvent(publicEndEvent, beforeMessage)
  addEvent(publicEndEvent, afterMessage)
  const buyerPlayerId = `${highestUntiedProfile.userId}_${gameId}`
  const buyerRef = playersRef.doc(buyerPlayerId)
  const tableauUpdate = leftmost == null
    ? {}
    : { tableau: arrayUnion(leftmost) }
  transaction.update(buyerRef, {
    gold: increment(-highestUntiedProfile.bid),
    events: arrayUnion(publicReadyEvent, buyerEndEvent),
    ...tableauUpdate
  })
  transaction.update(currentPlayerRef, {
    events: arrayUnion(privateReadyEvent, publicEndEvent),
    auctionReady: true
  })
  const profiles = currentGame.profiles.map(profile => {
    const tableauUpdate = leftmost == null
      ? {}
      : { tableau: [...profile.tableau, leftmost] }
    const buyerChanges = profile.userId === highestUntiedProfile.userId
      ? { gold: profile.gold - highestUntiedProfile.bid, ...tableauUpdate }
      : {}
    const currentPlayerChanges = profile.userId === currentPlayer.userId
      ? { auctionReady: true }
      : {}
    return {
      ...profile,
      ...buyerChanges,
      ...currentPlayerChanges
    }
  })
  transaction.update(currentGameRef, {
    profiles,
    events: arrayUnion(publicReadyEvent, publicEndEvent),
    timeline: currentGame.timeline
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
      events: arrayUnion(publicReadyEvent, publicEndEvent)
    })
  })
  console.info(`${currentUid} conceded!`)
})
export default concede
