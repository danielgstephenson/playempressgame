import { https } from 'firebase-functions/v1'
import guardDocData from '../guard/docData'
import guardJoinPhase from '../guard/joinPhase'
import createCloudFunction from '../create/cloudFunction'
import { gamesRef, profilesRef } from '../db'
import createEvent from '../create/event'
import { JoinGameProps } from '../types'
import { arrayUnion } from 'firelord'
import guardCurrentUser from '../guard/current/user'

const joinGame = createCloudFunction<JoinGameProps>(async (props, context, transaction) => {
  console.info(`Joining game ${props.gameId}...`)
  const { currentUser, currentUid } = await guardCurrentUser({ context, transaction })
  const gameRef = gamesRef.doc(props.gameId)
  const gameData = await guardDocData({
    docRef: gameRef,
    transaction
  })
  const existingGameUser = gameData.users.find(user => user.id === currentUid)
  if (existingGameUser != null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has already joined the game.'
    )
  }
  guardJoinPhase({ gameData })
  const profileId = `${currentUid}_${props.gameId}`
  const profileRef = profilesRef.doc(profileId)
  transaction.set(profileRef, {
    userId: currentUid,
    gameId: props.gameId,
    displayName: currentUser.displayName
  }, { merge: true })
  const gameUser = {
    id: currentUid,
    displayName: currentUser.displayName
  }
  transaction.update(gameRef, {
    users: arrayUnion(gameUser),
    history: arrayUnion(
      createEvent(`${currentUser.displayName} joined game ${props.gameId}.`)
    )
  })
  console.info(`Joined game ${props.gameId}!`)
})
export default joinGame
