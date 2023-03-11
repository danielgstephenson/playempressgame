import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'
import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { Identification, Firestream } from './types'
import streamFireViews from './views'

function EmptyAlert (): JSX.Element {
  return <Alert status='info'><AlertIcon /> No Data</Alert>
}
function ErrorAlert ({ error }: { error: Error }): JSX.Element {
  return <Alert status='error'><AlertIcon /> {error.message}</Alert>
}
export default function streamChakraFire <Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore
}: {
  collectionName: string
  toFirestore: (modelObject: WithFieldValue<Doc>) => DocumentData
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions) => Doc
}): Firestream<Doc> {
  return streamFireViews<Doc>({
    collectionName,
    toFirestore,
    fromFirestore,
    EmptyView: EmptyAlert,
    LoadingView: Spinner,
    ErrorView: ErrorAlert
  })
}
