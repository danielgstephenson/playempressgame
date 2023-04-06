import { Transaction } from "firebase-admin/firestore"
import { https, runWith } from "firebase-functions/v1"
import { db } from "../db"

export function createCloudFunction(
  callback: (
    props: any, 
    context: https.CallableContext, 
    transaction: Transaction
  ) => Promise<any>
) {
  return runWith({
    enforceAppCheck: true
  }).https.onCall(async (props, context) => {
    if (context.app == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      )
    }
    return db.runTransaction(async transaction => {
      return callback(props, context, transaction)
    })
  })
}