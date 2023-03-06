import { createContext, useContext, ReactNode, FC } from 'react'
import { DocumentReference, DocumentSnapshot, FirestoreError, Query, QuerySnapshot } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'

export default function getFirestream<Doc extends { id?: string }> (): {
  DocStreamer: FC<{ docRef?: DocumentReference<Doc>, View: FC<Doc>, children?: ReactNode }>
  QueryStreamer: FC<{ queryRef?: Query<Doc>, View: FC<Doc>, children?: ReactNode }>
  DocViewer: FC<{ View: FC<Doc> }>
  QueryViewer: FC<{ View: FC<Doc> }>
  docStreamContext: React.Context<{
    stream?: [Doc | undefined, boolean, FirestoreError | undefined, DocumentSnapshot<Doc> | undefined]
    doc?: Doc
    loading?: Boolean
    error?: FirestoreError
  }>
  queryStreamContext: React.Context<{
    stream?: [Doc[] | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Doc> | undefined]
    docs?: Doc[]
    loading?: Boolean
    error?: FirestoreError
  }>
  docContext: React.Context<{ doc?: Doc } & Partial<Doc>>
  queryContext: React.Context<{ docs?: Doc[] }>
  DocProvider: FC<{ doc?: Doc, children?: ReactNode }>
  QueryProvider: FC<{ docs?: Doc[], children?: ReactNode }>
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
    children?: ReactNode
  }): JSX.Element {
    const state: DocState = doc == null ? {} : { doc, ...doc }
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
    View: FC<Doc>
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
    return View != null ? <View {...data} /> : <></>
  }

  function DocStreamer ({
    docRef,
    View,
    children
  }: {
    docRef?: DocumentReference<Doc>
    View: FC<Doc>
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
    View: FC<Doc>
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
    const items = View != null && data.map(datum => (
      <View
        key={datum.id}
        {...datum}
      />
    ))
    return <>{items}</>
  }

  function QueryStreamer ({
    queryRef,
    View,
    children
  }: {
    queryRef?: Query<Doc>
    View: FC<Doc>
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
