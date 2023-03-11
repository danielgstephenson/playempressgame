import { DocumentData, Query, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from 'firebase/firestore'
import { createContext, useContext, ReactNode, FC } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import convertCollection from './convertCollection'
import getSafe from './getSafe'
import { ViewAndProps, Stream, HiderProps, Identification, Firestream, DocState, DocProviderProps, QueryState, QueryProviderProps, DocStreamState, QueryStreamState, StreamState, ErrorViewProps, ViewerProps, DocStreamerProps, QueryStreamerProps } from './types'

export function Viewing <Props> ({ View, ...props }: ViewAndProps<Props>): JSX.Element {
  if (View == null) return <></>
  return <View {...props} />
}
export function Hider <Data, Snapshot, Firestream extends Stream<Data, Snapshot>> ({
  streamState,
  children,
  EmptyView,
  LoadingView,
  ErrorView
}: HiderProps<Firestream>): JSX.Element {
  if (streamState.stream == null) return <></>
  console.log('streamState', streamState)
  const [data, loading, error] = streamState.stream
  if (loading) {
    return <Viewing View={LoadingView} />
  }
  if (error != null) {
    if (ErrorView == null) return <></>
    return <Viewing View={ErrorView} error={error} />
  }
  if (data == null) {
    if (EmptyView == null) return <></>
    return <EmptyView />
  }
  return <>{children}</>
}

export default function streamFire<Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore
}: {
  collectionName: string
  toFirestore: (modelObject: WithFieldValue<Doc>) => DocumentData
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions) => Doc
}): Firestream<Doc> {
  const docContext = createContext<DocState<Doc>>({})
  const queryContext = createContext<QueryState<Doc>>({})
  function DocProvider ({
    doc,
    children
  }: DocProviderProps<Doc>): JSX.Element {
    const state: DocState<Doc> = doc == null ? {} : { doc, ...doc }
    return (
      <docContext.Provider value={state}>
        {children}
      </docContext.Provider>
    )
  }
  function QueryProvider ({
    docs,
    children
  }: QueryProviderProps<Doc>): JSX.Element {
    const state: QueryState<Doc> = { docs }
    return (
      <queryContext.Provider value={state}>
        {children}
      </queryContext.Provider>
    )
  }
  const docStreamContext = createContext<DocStreamState<Doc>>({})
  const queryStreamContext = createContext<QueryStreamState<Doc>>({})
  function Viewer <Data, Snapshot, Firestream extends Stream<Data, Snapshot>> ({
    children,
    streamState,
    EmptyView,
    LoadingView,
    ErrorView
  }: {
    children?: ReactNode
    streamState: StreamState<Firestream>
    EmptyView?: FC
    LoadingView?: FC
    ErrorView?: FC<ErrorViewProps>
  }): JSX.Element {
    return (
      <Hider streamState={streamState} EmptyView={EmptyView} LoadingView={LoadingView} ErrorView={ErrorView}>
        {children}
      </Hider>
    )
  }
  function DocViewer ({ DocView, EmptyView, LoadingView, ErrorView }: ViewerProps): JSX.Element {
    const docStreamState = useContext(docStreamContext)
    return (
      <Viewer streamState={docStreamState} EmptyView={EmptyView} LoadingView={LoadingView} ErrorView={ErrorView}>
        <DocView />
      </Viewer>
    )
  }
  function QueryView ({ DocView, EmptyView }: {
    DocView: FC
    EmptyView?: FC
  }): JSX.Element {
    const queryStreamState = useContext(queryStreamContext)
    if (queryStreamState.docs?.length === 0) {
      if (EmptyView == null) return <></>
      return <EmptyView />
    }
    const items = queryStreamState.docs?.map(datum => (
      <DocProvider key={datum.id} doc={datum}>
        <DocView />
      </DocProvider>
    ))
    return <>{items}</>
  }
  function QueryViewer ({ DocView, EmptyView, LoadingView, ErrorView }: ViewerProps): JSX.Element {
    const queryStreamState = useContext(queryStreamContext)
    return (
      <Viewer streamState={queryStreamState} EmptyView={EmptyView} LoadingView={LoadingView} ErrorView={ErrorView}>
        <QueryView DocView={DocView} EmptyView={EmptyView} />
      </Viewer>
    )
  }
  const converter = { toFirestore, fromFirestore }
  function DocStreamer <Requirements extends {}> ({
    DocView,
    EmptyView,
    LoadingView,
    ErrorView,
    db,
    requirements,
    getRef,
    children
  }: DocStreamerProps<Doc, Requirements>): JSX.Element
  function DocStreamer <Requirements extends {}> ({
    DocView,
    EmptyView,
    LoadingView,
    ErrorView,
    db,
    requirements,
    getRef,
    children
  }: DocStreamerProps<Doc, Requirements>): JSX.Element {
    const ref = getSafe({
      db,
      collectionName,
      converter,
      requirements,
      getter: getRef
    })
    const stream = useDocumentData(ref)
    const [doc, loading, error] = stream
    const state: DocStreamState<Doc> = {
      stream,
      doc,
      loading,
      error
    }
    return (
      <docStreamContext.Provider value={state}>
        <DocProvider doc={doc}>
          {children}
          <DocViewer DocView={DocView} EmptyView={EmptyView} LoadingView={LoadingView} ErrorView={ErrorView} />
        </DocProvider>
      </docStreamContext.Provider>
    )
  }
  function QueryStreamer <Requirements extends {}> ({
    children,
    requirements,
    db,
    getRef,
    DocView,
    EmptyView,
    LoadingView,
    ErrorView
  }: QueryStreamerProps<Doc, Requirements>): JSX.Element {
    console.log('queryStreamer db test:', db)
    console.log('queryStreamer getRef test:', getRef)
    function getSafeRef (): Query<Doc> | undefined {
      if (db == null) return undefined
      if (getRef == null) {
        return convertCollection<Doc>({ db, collectionName, converter })
      }
      return getSafe({
        db,
        collectionName,
        converter,
        requirements,
        getter: getRef
      })
    }

    const q = getSafeRef()
    console.log('queryStreamer q test:', q)
    const stream = useCollectionData(q)
    console.log('queryStreamer stream test:', stream)
    const [docs, loading, error] = stream
    const state: QueryStreamState<Doc> = {
      stream,
      docs,
      loading,
      error
    }
    return (
      <queryStreamContext.Provider value={state}>
        <QueryProvider docs={docs}>
          {children}
          <QueryViewer DocView={DocView} EmptyView={EmptyView} LoadingView={LoadingView} ErrorView={ErrorView} />
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
