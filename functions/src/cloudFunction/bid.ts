import createCloudFunction from '../create/cloudFunction'
import { BidProps } from '../types'
import guardString from '../guard/string'
import guardNumber from '../guard/number'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import { playersRef } from '../db'
import getGrammar from '../get/grammar'
import createPlayState from '../create/playState'
import setPlayState from '../setPlayState'
import skipCourt from '../skipCourt'
import buy from '../buy'
import addCourtEvents from '../add/events/court'

const bid = createCloudFunction<BidProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const bid = guardNumber(props.bid, 'Play ready bid')
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
  console.info(`Bidding ${bid} for ${currentUid}...`)
  if (currentPlayer.auctionReady) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are ready to end the auction.'
    )
  }
  if (currentPlayer.gold < bid) {
    throw new https.HttpsError(
      'out-of-range',
      'You do not have enough gold.'
    )
  }
  if (currentPlayer.bid >= bid) {
    throw new https.HttpsError(
      'out-of-range',
      'You may only raise.'
    )
  }
  if (currentPlayer.withdrawn) {
    throw new https.HttpsError(
      'failed-precondition',
      'You withdrew.'
    )
  }
  if (bid % 5 !== 0) {
    throw new https.HttpsError(
      'invalid-argument',
      'You may only bid gold.'
    )
  }
  const oldHighestUntiedProfile = getHighestUntiedProfile(currentGame)
  const tying = oldHighestUntiedProfile?.bid === bid
  console.log('tying', tying)
  currentProfile.bid = props.bid
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  const highestOtherGold = currentGame.profiles.reduce((highest, profile) => {
    if (profile.withdrawn) {
      return highest
    }
    if (profile.userId === currentUid) {
      return highest
    }
    if (profile.gold > highest) {
      return profile.gold
    }
    return highest
  }, 0)
  if (bid > highestOtherGold) {
    currentPlayer.bid = props.bid
    const playState = await createPlayState({
      currentGame,
      currentPlayer,
      transaction
    })
    const { spelled } = getGrammar(bid)
    const privateBidMessage = `You bid ${spelled}, more gold than anyone else has`
    const publicBidMessage = `${currentPlayer.displayName} bid ${spelled}, more gold than anyone else has`
    if (currentGame.court.length === 0) {
      skipCourt({
        bid: props.bid,
        buyerId: currentPlayer.id,
        buyerName: currentPlayer.displayName,
        loserMessage: publicBidMessage,
        buyerMessage: privateBidMessage,
        playState
      })
      setPlayState({
        playState,
        transaction
      })
      console.info(`${currentUid} conceded!`)
      return
    }
    buy({
      bid: props.bid,
      buyerId: currentPlayer.id,
      loserMessage: publicBidMessage,
      buyerMessage: privateBidMessage,
      name: currentPlayer.displayName,
      playState
    })
    addCourtEvents({
      playState,
      buyerId: currentPlayer.id,
      buyerName: currentPlayer.displayName
    })
    setPlayState({
      playState,
      transaction
    })
    console.info(`${currentUid} conceded!`)
    return
  }
  const winning = highestUntiedProfile?.userId === currentUid
  const { spelled } = getGrammar(bid)
  const privateBidMessage = `You bid ${spelled}`
  const publicBidMessage = `${currentPlayer.displayName} bid ${spelled}`
  const highestMessage = 'the highest untied bidder'
  const privateMessage = winning
    ? `${privateBidMessage}, making you ${highestMessage}.`
    : `${privateBidMessage}.`
  const currentPlayerEvent = createEvent(privateMessage)
  transaction.update(currentPlayerRef, {
    bid,
    events: arrayUnion(currentPlayerEvent),
    lastBidder: true,
    auctionReady: winning
  })
  console.log('bid', bid)
  console.log('highestUntiedProfile', highestUntiedProfile)
  console.log('winning', winning)
  const pivotal = winning || tying
  console.log('pivotal', pivotal)
  const profiles = currentGame.profiles.map(profile => {
    if (profile.withdrawn) {
      return profile
    }
    if (profile.userId === currentUid) {
      return { ...profile, auctionReady: winning, bid, lastBidder: true }
    }
    const pivotalUpdate = pivotal
      ? { auctionReady: false }
      : {}
    return { ...profile, lastBidder: false, ...pivotalUpdate }
  })
  const publicMessage = winning
    ? `${publicBidMessage}, making them ${highestMessage}.`
    : `${publicBidMessage}.`
  const observerEvent = createEvent(publicMessage)
  transaction.update(currentGameRef, {
    profiles,
    events: arrayUnion(observerEvent)
  })
  currentGame.profiles.forEach((profile) => {
    if (profile.userId === currentUid) return
    const playerId = `${profile.userId}_${gameId}`
    const playerRef = playersRef.doc(playerId)
    if (profile.withdrawn) {
      transaction.update(playerRef, {
        events: arrayUnion(observerEvent)
      })
      return
    }
    const pivotalUpdate = pivotal
      ? { auctionReady: false }
      : {}
    transaction.update(playerRef, {
      events: arrayUnion(observerEvent),
      lastBidder: false,
      ...pivotalUpdate
    })
  })
  console.info(`${currentPlayer.id} bid ${spelled}!`)
})
export default bid
