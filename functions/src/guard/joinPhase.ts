import { https } from "firebase-functions/v1";
import { GameData } from "../types";

export default function guardJoinPhase({
  gameData
} : {
  gameData: GameData 
}) {
  if (gameData.phase !== 'join') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game has already started.'
    )
  }
}