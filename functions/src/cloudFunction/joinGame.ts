import { https } from 'firebase-functions/v1'
import guardDocData from '../guard/docData'
import guardJoinPhase from '../guard/joinPhase'
import createCloudFunction from '../create/cloudFunction'
import { gamesRef } from '../db'
import createEvent from '../create/event'
import { GameProps } from '../types'
import { arrayUnion } from 'firelord'
import guardCurrentUser from '../guard/current/user'

const joinGame = createCloudFunction<GameProps>(async (props, context, transaction) => {
  console.info(`Joining game ${props.gameId}...`)
  const { currentUser, currentUid } = await guardCurrentUser({ context, transaction })
  const gameRef = gamesRef.doc(props.gameId)
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
    deckEmpty: true,
    displayName: currentUser.displayName,
    gameId: props.gameId,
    gold: 0,
    playAreaEmpty: true,
    ready: false,
    silver: 0,
    trashAreaEmpty: true,
    trashHistory: [],
    userId: currentUid
  }
  transaction.update(gameRef, {
    profiles: arrayUnion(profile),
    history: arrayUnion(
      createEvent(`${currentUser.displayName} joined game ${props.gameId}.`)
    )
  })
  console.info(`Joined game ${props.gameId}!`)
})
export default joinGame
