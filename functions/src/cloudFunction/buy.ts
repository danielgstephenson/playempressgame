import createCloudFunction from '../create/cloudFunction'
import { GameProps, Player, Write } from '../types'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import { arrayUnion, increment } from 'firelord'
import getGrammar from '../get/grammar'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import getHighestUntiedProfile from '../get/highestUntiedProfile'
import { END_AUCTION, END_AUCTION_PLAYER } from '../constants'
import { playersRef } from '../db'

const imprison = createCloudFunction<GameProps>(async (props, context, transaction) => {
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
  console.info(`Readying ${currentPlayer.id} for buying...`)
  const highestUntiedProfile = getHighestUntiedProfile(currentGame)
  if (highestUntiedProfile?.userId !== currentPlayer.userId) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not the highest untied bidder.'
    )
  }
  const privateReadyEvent = createEvent('You are ready to buy.')
  const publicReadyEvent = createEvent(`${currentPlayer.displayName} is ready to buy.`)
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
    updateAuctionWaiting({
      currentGame,
      currentPlayer,
      privateEvent: privateReadyEvent,
      publicEvent: publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} is ready to buy!`)
    return
  }
  const leftmost = currentGame.timeline[0]
  const endMessage = 'Everyone is ready, so'
  const { spelled } = getGrammar(currentPlayer.bid)
  const privateEndSuffix = leftmost == null
    ? 'the auction ends'
    : `you pay ${spelled} gold and take ${leftmost.rank} into your tableau`
  const privateEndEvent = createEvent(`${endMessage} ${privateEndSuffix}.`)
  const publicEndSuffix = leftmost == null
    ? 'the auction ends'
    : `${currentPlayer.displayName} pays ${spelled} gold and takes ${leftmost.rank} into their tableau`
  const publicEndEvent = createEvent(`${endMessage} ${publicEndSuffix}.`)
  const tableauUpdate = leftmost == null
    ? {}
    : { tableau: arrayUnion(leftmost) }
  transaction.update(currentPlayerRef, {
    ...END_AUCTION_PLAYER,
    events: arrayUnion(privateReadyEvent, privateEndEvent),
    gold: increment(-currentPlayer.bid),
    ...tableauUpdate
  })
  const profiles = currentGame.profiles.map(profile => {
    const tableauUpdate = leftmost == null
      ? {}
      : { tableau: [...profile.tableau, leftmost] }
    const currentChanges = profile.userId === currentPlayer.userId
      ? { gold: currentPlayer.gold - currentPlayer.bid, ...tableauUpdate }
      : {}
    return {
      ...profile,
      ...END_AUCTION,
      ...currentChanges
    }
  })
  transaction.update(currentGameRef, {
    events: arrayUnion(publicReadyEvent, publicEndEvent),
    profiles
  })
  const publicUpdate: Write<Player> = {
    events: arrayUnion(publicReadyEvent, publicEndEvent),
    ...END_AUCTION_PLAYER
  }
  currentGame.profiles.forEach(profile => {
    if (profile.userId === currentPlayer.userId) {
      return
    }
    const playerId = `${profile.userId}_${currentGame.id}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, publicUpdate)
  })
  console.info(`${currentUid} bought!`)
})
export default imprison
