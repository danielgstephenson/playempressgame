import createCloudFunction from '../create/cloudFunction'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import imprisonLastReady from '../ready/last/imprison'
import { GameProps } from '../types'
import getImprisonMessages from '../get/imprisonMessages'
import createPlayState from '../create/playState'
import setPlayState from '../setPlayState'

const imprison = createCloudFunction<GameProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const {
    currentGame,
    currentUid,
    currentPlayer
  } = await guardAuctionUnready({
    gameId,
    transaction,
    context
  })
  console.info(`Readying ${currentPlayer.id} to imprison...`)
  const tiers = currentGame
    .profiles
    .filter(profile => currentGame
      .profiles
      .some(otherProfile => otherProfile.userId !== profile.userId && otherProfile.bid === profile.bid)
    )
  if (tiers.length !== currentGame.profiles.length) {
    throw new https.HttpsError(
      'failed-precondition',
      'Everyone is not tied.'
    )
  }
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
    const { privateMessage, publicMessage } = getImprisonMessages({
      game: currentGame,
      currentPlayer
    })
    const privateReadyEvent = createEvent(privateMessage)
    const publicReadyEvent = createEvent(publicMessage)
    updateAuctionWaiting({
      currentGame,
      currentPlayer,
      privateEvent: privateReadyEvent,
      publicEvent: publicReadyEvent,
      transaction
    })
    console.info(`${currentUid} is ready to imprison!`)
    return
  }
  const playState = await createPlayState({
    currentGame,
    currentPlayer,
    transaction
  })
  imprisonLastReady({
    currentPlayer,
    playState
  })
  setPlayState({
    playState,
    transaction
  })
  console.info(`${currentUid} imprisoned!`)
})
export default imprison
