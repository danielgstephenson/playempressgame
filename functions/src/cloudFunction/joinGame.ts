import { https } from "firebase-functions/v1"
import checkCurrentUid from "../guard/currentUid"
import checkDocData from "../guard/docData"
import checkJoinPhase from "../guard/joinPhase"
import { createCloudFunction } from "../create/cloudFunction"
import { gamesRef, profilesRef, usersRef } from "../db"
import admin from 'firebase-admin';

const joinGame = createCloudFunction(async (props, context, transaction) => {
  const currentUid = checkCurrentUid({ context })
  const {
    docData : userData
  } = await checkDocData({
    collectionRef: usersRef,
    docId: currentUid,
    transaction
  })
  const { 
    docData : gameData, 
    docRef : gameRef 
  } = await checkDocData({
    collectionRef: gamesRef,
    docId: props.gameId,
    transaction
  })
  if (gameData.userIds.includes(currentUid)) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has already joined the game.'
    )
  }
  checkJoinPhase({gameData})
  console.log(`joining game ${props.gameId}...`)
  const profileId = `${currentUid}_${props.gameId}`
  const profileRef = profilesRef.doc(profileId)
  transaction.set(profileRef, { 
    userId: currentUid,
    gameId: props.gameId,
    displayName: userData.displayName,
  })
  transaction.update(gameRef, {
    userIds: admin.firestore.FieldValue.arrayUnion(currentUid)
  })
  console.log(`joined game ${props.gameId}!`)
})
export default joinGame