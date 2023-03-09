import { createContext, useContext, ReactNode, FC } from 'react'
import { DocumentReference, DocumentSnapshot, FirestoreError, Query, QuerySnapshot } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'

export type DocState <Doc> = { doc?: Doc } & Partial<Doc>
export interface DocStreamerProps <Doc> {
  docRef?: DocumentReference<Doc>
  View: FC
  children?: ReactNode
}
export interface QueryStreamerProps <Doc> {
  queryRef?: Query<Doc>
  View: FC
  children?: ReactNode
}
export interface ViewerProps {
  View: FC
}
export type Stream <Data, Snapshot> = [
  Data | undefined,
  boolean, FirestoreError | undefined,
  Snapshot | undefined
]
export type DocStream <Doc> = Stream<Doc, DocumentSnapshot<Doc>>
export type QueryStream <Doc> = Stream<Doc[], QuerySnapshot<Doc>>
export interface StreamState <Stream> {
  stream?: Stream
  loading?: Boolean
  error?: FirestoreError
}
export interface DocStreamState <Doc> extends StreamState<DocStream<Doc>> {
  doc?: Doc
}
export interface QueryStreamState <Doc> extends StreamState<QueryStream<Doc>> {
  docs?: Doc[]
}
export interface QueryState <Doc> {
  docs?: Doc[]
}
export interface DocProviderProps <Doc> {
  doc?: Doc
  children?: ReactNode
}
export interface QueryProviderProps <Doc> {
  docs?: Doc[]
  children?: ReactNode
}
export interface Identification {
  id?: string
}

export default function firestream<Doc extends Identification> (): {
  DocStreamer: FC<DocStreamerProps<Doc>>
  QueryStreamer: FC<QueryStreamerProps<Doc>>
  DocViewer: FC<ViewerProps>
  QueryViewer: FC<ViewerProps>
  docStreamContext: React.Context<DocStreamState<Doc>>
  queryStreamContext: React.Context<QueryStreamState<Doc>>
  docContext: React.Context<DocState<Doc>>
  queryContext: React.Context<QueryState<Doc>>
  DocProvider: FC<DocProviderProps<Doc>>
  QueryProvider: FC<QueryProviderProps<Doc>>
} {
  const docContext = createContext<DocState<Doc>>({})

  function DocProvider ({
    doc,
    children
  }: {
    doc?: Doc
    children?: ReactNode
  }): JSX.Element {
    const state: DocState<Doc> = doc == null ? {} : { doc, ...doc }
    return (
      <docContext.Provider value={state}>
        {children}
      </docContext.Provider>
    )
  }
  interface QueryState {
    docs?: Doc[]
  }
  const queryContext = createContext<QueryState>({})

  function QueryProvider ({
    docs,
    children
  }: {
    docs?: Doc[]
    children?: ReactNode
  }): JSX.Element {
    const state: QueryState = { docs }

    return (
      <queryContext.Provider value={state}>
        {children}
      </queryContext.Provider>
    )
  }
  type DocStream = [Doc | undefined, boolean, FirestoreError | undefined, DocumentSnapshot<Doc> | undefined]

  interface DocStreamState {
    stream?: DocStream
    doc?: Doc
    loading?: Boolean
    error?: FirestoreError
  }

  type QueryStream = [Doc[] | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Doc> | undefined]

  interface QueryStreamState {
    stream?: QueryStream
    docs?: Doc[]
    loading?: Boolean
    error?: FirestoreError
  }

  const docStreamContext = createContext<DocStreamState>({})
  const queryStreamContext = createContext<QueryStreamState>({})

  function DocViewer ({ View }: {
    View: FC
  }): JSX.Element {
    const docStreamState = useContext(docStreamContext)
    if (docStreamState.stream == null) return <></>
    const [data, loading, error] = docStreamState.stream
    if (loading) {
      return <Spinner />
    }
    if (error != null) {
      return <Alert status='error'> <AlertIcon /> {error.message}</Alert>
    }
    if (data == null) {
      return <></>
    }
    return <View />
  }

  function DocStreamer ({
    docRef,
    View,
    children
  }: {
    docRef?: DocumentReference<Doc>
    View: FC
    children?: ReactNode
  }): JSX.Element {
    const stream = useDocumentData(docRef)
    const [doc, loading, error] = stream
    const state: DocStreamState = {
      stream,
      doc,
      loading,
      error
    }
    return (
      <docStreamContext.Provider value={state}>
        <DocProvider doc={doc}>
          {children}
          <DocViewer View={View} />
        </DocProvider>
      </docStreamContext.Provider>
    )
  }

  function QueryViewer ({ View }: {
    View: FC
  }): JSX.Element {
    const queryStreamState = useContext(queryStreamContext)
    if (queryStreamState.stream == null) return <></>
    const [data, loading, error] = queryStreamState.stream
    if (loading) {
      return <Spinner />
    }
    if (error != null) {
      return <Alert status='error'><AlertIcon /> {error.message}</Alert>
    }
    if (data == null) {
      return <></>
    }
    if (data.length === 0) {
      return <Alert status='info'><AlertIcon />No Data</Alert>
    }
    const items = data.map(datum => (
      <DocProvider key={datum.id} doc={datum}>
        <View />
      </DocProvider>
    ))
    return <>{items}</>
  }

  function QueryStreamer ({
    queryRef,
    View,
    children
  }: {
    queryRef?: Query<Doc>
    View: FC
    children?: ReactNode
  }): JSX.Element {
    const stream = useCollectionData(queryRef)
    const [docs, loading, error] = stream
    const state: QueryStreamState = {
      stream,
      docs,
      loading,
      error
    }
    return (
      <queryStreamContext.Provider value={state}>
        <QueryProvider docs={docs}>
          {children}
          <QueryViewer View={View} />
        </QueryProvider>
      </queryStreamContext.Provider>
    )
  }

  return {
    DocStreamer,
    QueryStreamer,
    DocViewer,
    QueryViewer,
    docContext,
    queryContext,
    docStreamContext,
    queryStreamContext,
    DocProvider,
    QueryProvider
  }
}
