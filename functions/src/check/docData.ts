import { CollectionReference, DocumentData, Transaction } from "firebase-admin/firestore";
import { https } from "firebase-functions/v1";
import { DocCheck } from "../types";

export default async function checkDocData({
  collectionRef,
  docId,
  transaction
} : {
  collectionRef : CollectionReference,
  docId: string,
  transaction: Transaction
}): Promise<DocCheck> {
  const docRef = collectionRef.doc(docId)
  const doc = await transaction.get(docRef)
  if (!doc.exists) {
    throw new https.HttpsError(
      'unavailable',
      'This doc does not exist.'
    )
  }
  const docData = doc.data()
  if (docData == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This doc is empty.'
    )
  }

  return {docRef, doc, docData}
}