import { HttpsFunction, https, runWith } from 'firebase-functions'
import { runTransaction } from 'firelord'
import { CloudCallback } from '../types'

export default function createCloudFunction <Props> (
  callback: CloudCallback<Props>
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
    if (Array.isArray(callback)) {
      for (const c of callback) {
        await runTransaction(async transaction => {
          return await c(props, context, transaction)
        })
      }
      return
    }
    return await runTransaction(async transaction => {
      return await callback(props, context, transaction)
    })
  })
}
