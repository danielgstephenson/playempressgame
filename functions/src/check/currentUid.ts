import { https } from "firebase-functions/v1";

export default function checkCurrentUid({context}:{
  context: https.CallableContext
}): string {
  if (context.auth == null) {
    throw new https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    )
  }

  return context.auth.uid
}