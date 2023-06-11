import createCloudFunction from '../create/cloudFunction'
import guardString from '../guard/string'
import { https } from 'firebase-functions/v1'
import createEvent from '../create/event'
import getJoinedRanksGrammar from '../get/joined/ranks/grammar'
import guardAuctionUnready from '../guard/auctionUnready'
import isAuctionWaiting from '../is/auctionWaiting'
import updateAuctionWaiting from '../update/auctionWaiting'
import updateImprison from '../update/imprison'
import getJoined from '../get/joined'
import getOtherPlayers from '../get/otherPlayers'
import { GameProps } from '../types'

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
  console.log('currentGame.profiles', currentGame.profiles)
  const tiers = currentGame
    .profiles
    .filter(profile => currentGame
      .profiles
      .some(otherProfile => otherProfile.userId !== profile.userId && otherProfile.bid === profile.bid)
    )
  console.log('tiers', tiers)
  if (tiers.length !== currentGame.profiles.length) {
    throw new https.HttpsError(
      'failed-precondition',
      'Everyone is not tied.'
    )
  }
  const leftmostTimeline = currentGame.timeline.shift()
  const joinedCourt = getJoinedRanksGrammar(currentGame.court)
  const readyMessage = 'ready to imprison'
  const schemeMessages = []
  if (leftmostTimeline != null) {
    schemeMessages.push(`${leftmostTimeline.rank} from the timeline`)
  }
  if (currentGame.court.length > 0) {
    schemeMessages.push(`${joinedCourt.joinedRanks} from the court`)
  }
  const schemesMessage = getJoined(schemeMessages)
  const imprisonMessage = `${readyMessage} ${schemesMessage}.`
  const privateMessage = `You are ${imprisonMessage}`
  const publicMessage = `${currentPlayer.displayName} is ${imprisonMessage}`
  const privateReadyEvent = createEvent(privateMessage)
  const publicReadyEvent = createEvent(publicMessage)
  const waiting = isAuctionWaiting(currentGame)
  if (waiting) {
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
  currentPlayer.events.push(privateReadyEvent)
  const otherPlayers = await getOtherPlayers({
    currentUid: currentPlayer.userId,
    gameId: props.gameId,
    transaction
  })
  otherPlayers.forEach(player => player.events.push(publicReadyEvent))
  const players = [currentPlayer, ...otherPlayers]
  const playState = {
    game: currentGame,
    players
  }
  await updateImprison({
    currentPlayer,
    playState,
    transaction
  })
  console.info(`${currentUid} imprisoned!`)
})
export default imprison
