import { CollectionReference, DocumentData, Transaction } from "firebase-admin/firestore";
import { https } from "firebase-functions/v1";
import { DocCheck } from "../types";

export default async function guardDocData({
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
    const path = `${collectionRef.path}/${docId}`
    throw new https.HttpsError(
      'unavailable',
      `${path} does not exist.`
    )
  }
  const docData = doc.data()
  if (docData == null) {
    const path = `${collectionRef.path}/${docId}`
    throw new https.HttpsError(
      'failed-precondition',
      `${path} is empty.`
    )
  }

  return {docRef, doc, docData}
}