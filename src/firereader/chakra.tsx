import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'
import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { Identification, CollectionReaders } from './types'
import firereaderViews from './views'

function EmptyAlert (): JSX.Element {
  return <Alert status='info'><AlertIcon /> No Data</Alert>
}
function ErrorAlert ({ error }: { error: Error }): JSX.Element {
  return <Alert status='error'><AlertIcon /> {error.message}</Alert>
}
export default function firereaderChakra <Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore
}: {
  collectionName: string
  toFirestore: (doc: Doc) => Doc
  fromFirestore: (snapshot: QueryDocumentSnapshot<Doc>, options?: SnapshotOptions) => Doc
}): CollectionReaders<Doc> {
  return firereaderViews<Doc>({
    collectionName,
    toFirestore,
    fromFirestore,
    EmptyView: EmptyAlert,
    LoadingView: Spinner,
    ErrorView: ErrorAlert
  })
}
