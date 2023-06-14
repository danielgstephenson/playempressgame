import createCloudFunction from '../create/cloudFunction'
import { GameProps } from '../types'
import guardString from '../guard/string'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion, increment } from 'firelord'
import imprisonLastReady from '../ready/last/imprison'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import getGrammar from '../get/grammar'
import { playersRef } from '../db'
import getOtherPlayers from '../get/otherPlayers'
import getJoinedRanks from '../get/joined/ranks'
import addEvent from '../add/event'
import setPlayState from '../setPlayState'
import createPlayState from '../create/playState'
import skipCourt from '../skipCourt'
import addTargetEvents from '../add/events/target'

const withdraw = createCloudFunction<GameProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayer,
    currentPlayerRef,
    currentProfile
  } = await guardCurrentBidding({
    gameId,
    transaction,
    context
  })
  console.info(`${currentPlayer.id} withdrawing...`)
  if (currentPlayer.auctionReady) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are already ready to end the auction.'
    )
  }
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
  const privateReadyMessage = 'You withdraw.'
  const publicReadyMessage = `${currentPlayer.displayName} withdrew.`
  const privateReadyEvent = createEvent(privateReadyMessage)
  const publicReadyEvent = createEvent(publicReadyMessage)
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
  currentProfile.withdrawn = true
  currentProfile.auctionReady = true
  currentPlayer.withdrawn = true
  currentPlayer.auctionReady = true
  console.log('currentGame.profiles', currentGame.profiles)
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  console.log('highestUntiedProfile', highestUntiedProfile)
  if (highestUntiedProfile == null) {
    const otherPlayers = await getOtherPlayers({
      currentUid,
      gameId: props.gameId,
      transaction
    })
    const players = [currentPlayer, ...otherPlayers]
    const playState = {
      game: currentGame,
      players
    }
    imprisonLastReady({
      playState,
      currentPlayer
    })
    setPlayState({
      playState,
      transaction
    })
    console.info(`${currentUid} withdrew!`)
    return
  }
  const buyerPlayerId = `${highestUntiedProfile.userId}_${gameId}`
  if (currentGame.court.length === 0) {
    const playState = await createPlayState({
      currentGame,
      currentPlayer,
      transaction
    })
    const privateReadyMessage = 'You withdraw.'
    const publicReadyMessage = `${currentPlayer.displayName} withdrew.`
    addTargetEvents({
      playState,
      message: publicReadyMessage,
      targetMessages: {
        [currentPlayer.id]: privateReadyMessage
      }
    })
    skipCourt({
      bid: highestUntiedProfile.bid,
      buyerId: buyerPlayerId,
      buyerName: highestUntiedProfile.displayName,
      message: 'Everyone is ready',
      playState
    })
    setPlayState({
      playState,
      transaction
    })
    console.info(`${currentUid} withdrew!`)
    return
  }
  const beforeTimeline = [...currentGame.timeline]
  const beforeTimelineJoined = getJoinedRanks(beforeTimeline)
  const beforeTimelineMessage = `The timeline was ${beforeTimelineJoined}.`
  const leftmost = currentGame.timeline.shift()
  const afterTimeline = [...currentGame.timeline]
  const afterTimelineJoined = getJoinedRanks(afterTimeline)
  const afterTimelineMessage = `The timeline becomes ${afterTimelineJoined}.`
  const endMessage = 'Everyone is ready, so'
  const { spelled } = getGrammar(highestUntiedProfile.bid)
  const buyerEndSuffix = leftmost == null
    ? 'the auction ends'
    : `you pay ${spelled} gold and take ${leftmost.rank} into your tableau`
  const buyerEndMessage = `${endMessage} ${buyerEndSuffix}.`
  const loserEndSuffix = leftmost == null
    ? 'the auction ends'
    : `${highestUntiedProfile.displayName} pays ${spelled} gold and takes ${leftmost.rank} into their tableau`
  const loserEndMessage = `${endMessage} ${loserEndSuffix}.`
  const buyerEndEvent = createEvent(buyerEndMessage)
  addEvent(buyerEndEvent, beforeTimelineMessage)
  addEvent(buyerEndEvent, afterTimelineMessage)
  const publicEndEvent = createEvent(loserEndMessage)
  addEvent(publicEndEvent, beforeTimelineMessage)
  addEvent(publicEndEvent, afterTimelineMessage)
  const buyerRef = playersRef.doc(buyerPlayerId)
  const tableauUpdate = leftmost == null
    ? {}
    : { tableau: arrayUnion(leftmost) }
  const courtJoined = getJoinedRanks(currentGame.court)
  const buyerCourtMessage = `Choose which of ${courtJoined} to take from the court.`
  const loserCourtMessage = `${highestUntiedProfile.displayName} is choosing which of ${courtJoined} to take from the court.`
  const buyerCourtEvent = createEvent(buyerCourtMessage)
  const loserCourtEvent = createEvent(loserCourtMessage)
  transaction.update(buyerRef, {
    gold: increment(-highestUntiedProfile.bid),
    events: arrayUnion(publicReadyEvent, buyerEndEvent, buyerCourtEvent),
    auctionReady: true,
    ...tableauUpdate
  })
  transaction.update(currentPlayerRef, {
    events: arrayUnion(privateReadyEvent, publicEndEvent, loserCourtEvent),
    auctionReady: true
  })
  const profiles = currentGame.profiles.map(profile => {
    const tableauUpdate = leftmost == null
      ? {}
      : { tableau: [...profile.tableau, leftmost] }
    const buyerChanges = profile.userId === highestUntiedProfile.userId
      ? { gold: profile.gold - highestUntiedProfile.bid, ...tableauUpdate }
      : {}
    return {
      ...profile,
      ...buyerChanges,
      auctionReady: true
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
      auctionReady: true
    })
  })
  console.info(`${currentUid} withdrew!`)
})
export default withdraw
