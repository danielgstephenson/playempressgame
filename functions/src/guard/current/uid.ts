import { https } from 'firebase-functions'

export default function guardCurrentUid ({ context }: {
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
