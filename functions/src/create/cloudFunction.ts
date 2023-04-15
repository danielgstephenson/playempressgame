import { HttpsFunction, https, runWith } from 'firebase-functions'
import { Transaction, runTransaction } from 'firelord'

export function createCloudFunction <T> (
  callback: (
    props: T,
    context: https.CallableContext,
    transaction: Transaction
  ) => Promise<any>
): HttpsFunction {
  return runWith({
    enforceAppCheck: true
  }).https.onCall(async (props, context) => {
    if (context.app == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      )
    }
    return await runTransaction(async transaction => {
      return await callback(props, context, transaction)
    })
  })
}
