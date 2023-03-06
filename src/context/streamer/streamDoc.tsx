import { createContext, useContext, ReactNode, FC } from 'react'
import { DocumentSnapshot, FirestoreError, DocumentReference } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'

export default function streamDoc<Doc> ({ View }: {
  View?: FC<Doc>
}): {
    Streamer: FC<{ docRef?: DocumentReference<Doc>, children: ReactNode }>
    Viewer: FC
    docContext: React.Context<{ doc?: Doc } & Partial<Doc>>
    streamContext: React.Context<{
      stream?: [Doc | undefined, boolean, FirestoreError | undefined, DocumentSnapshot<Doc> | undefined]
      doc?: Doc
      loading?: Boolean
      error?: FirestoreError
    }>
    DocProvider: FC<{ doc?: Doc, children: ReactNode }>
  } {
  interface DocData {
    doc?: Doc
  }
  type DocState = DocData & Partial<Doc>

  const docContext = createContext<DocState>({})

  function DocProvider ({
    doc,
    children
  }: {
    doc?: Doc
    children: ReactNode
  }): JSX.Element {
    const state: DocState = doc == null ? {} : { doc, ...doc }
    return (
      <docContext.Provider value={state}>
        {children}
      </docContext.Provider>
    )
  }

  type Stream = [Doc | undefined, boolean, FirestoreError | undefined, DocumentSnapshot<Doc> | undefined]

  interface StreamState {
    stream?: Stream
    doc?: Doc
    loading?: Boolean
    error?: FirestoreError
  }

  const streamContext = createContext<StreamState>({})

  function Viewer (): JSX.Element {
    const streamState = useContext(streamContext)
    if (streamState.stream == null) return <></>
    const [data, loading, error] = streamState.stream
    if (loading) {
      return <Spinner />
    }
    if (error != null) {
      return <Alert status='error'> <AlertIcon /> {error.message}</Alert>
    }
    if (data == null) {
      return <></>
    }
    return View != null ? <View {...data} /> : <></>
  }

  function Streamer ({
    docRef,
    children
  }: {
    docRef?: DocumentReference<Doc>
    children: ReactNode
  }): JSX.Element {
    const stream = useDocumentData(docRef)
    const [doc, loading, error] = stream
    const state: StreamState = {
      stream,
      doc,
      loading,
      error
    }
    return (
      <streamContext.Provider value={state}>
        <DocProvider doc={doc}>
          {children}
          <Viewer />
        </DocProvider>
      </streamContext.Provider>
    )
  }

  return {
    Streamer,
    Viewer,
    docContext,
    streamContext,
    DocProvider
  }
}
