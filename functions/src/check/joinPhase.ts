import { CollectionReference, DocumentData, Transaction } from "firebase-admin/firestore";
import { https } from "firebase-functions/v1";

export default function checkJoinPhase({
  gameData
} : {
  gameData: DocumentData
}) {
  if (gameData.phase !== 'join') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game has already started.'
    )
  }
}