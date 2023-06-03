import { https } from 'firebase-functions/v1'
import guardDocData from '../guard/docData'
import guardJoinPhase from '../guard/joinPhase'
import createCloudFunction from '../create/cloudFunction'
import { gamesRef } from '../db'
import createEvent from '../create/event'
import { GameProps } from '../types'
import { arrayUnion } from 'firelord'
import guardCurrentUser from '../guard/current/user'
import guardString from '../guard/string'

const joinGame = createCloudFunction<GameProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Join game id')
  const { currentUser, currentUid } = await guardCurrentUser({ context, transaction })
  const gameRef = gamesRef.doc(gameId)
  const gameData = await guardDocData({
    docRef: gameRef,
    transaction
  })
  const existingProfile = gameData.profiles.find(profile => profile.userId === currentUid)
  if (existingProfile != null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has already joined the game.'
    )
  }
  guardJoinPhase({ gameData })
  const profile = {
    auctionReady: false,
    bid: 0,
    deckEmpty: true,
    displayName: currentUser.displayName,
    gameId,
    gold: 0,
    lastBidder: false,
    playAreaEmpty: true,
    playReady: false,
    silver: 0,
    trashAreaEmpty: true,
    trashHistory: [],
    userId: currentUid,
    withdrawn: false
  }
  transaction.update(gameRef, {
    profiles: arrayUnion(profile),
    events: arrayUnion(
      createEvent(`${currentUser.displayName} joined game ${gameId}.`)
    )
  })
  console.info(`Joined game ${gameId}!`)
})
export default joinGame
