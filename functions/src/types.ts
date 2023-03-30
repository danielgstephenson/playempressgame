import { DocumentData, DocumentReference, DocumentSnapshot } from "firebase-admin/firestore"

export interface DocCheck {
  docRef : DocumentReference
  doc: DocumentSnapshot<DocumentData>
  docData: DocumentData
}