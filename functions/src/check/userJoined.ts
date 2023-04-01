import { https } from "firebase-functions";


export default function checkUserJoined({
  gameData,
  userId
}:{
  gameData: any
  userId: string
}) {
  if (!gameData.userIds.includes(userId)) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has not joined the game.'
    )
  }
}