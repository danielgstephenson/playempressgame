import createCloudFunction from '../create/cloudFunction'
import { GameProps } from '../types'
import guardString from '../guard/string'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import imprisonLastReady from '../ready/last/imprison'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import { playersRef } from '../db'
import getOtherPlayers from '../get/otherPlayers'
import setPlayState from '../setPlayState'
import createPlayState from '../create/playState'
import addTargetEvents from '../add/events/target'
import buy from '../buy'

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
  const playState = await createPlayState({
    currentGame,
    currentPlayer,
    transaction
  })
  addTargetEvents({
    playState,
    message: publicReadyMessage,
    targetMessages: {
      [currentPlayer.id]: privateReadyMessage
    }
  })
  buy({
    bid: highestUntiedProfile.bid,
    buyerId: buyerPlayerId,
    name: highestUntiedProfile.displayName,
    message: 'Everyone is ready',
    playState
  })
  setPlayState({
    playState,
    transaction
  })
})
export default withdraw
