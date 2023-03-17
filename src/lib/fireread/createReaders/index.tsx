import { Query } from 'firebase/firestore'
import { createContext, useContext, ReactNode, FC } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import convertCollection from '../convertCollection'
import getSafe from '../getSafe'
import Hider from '../Hider'
import { Stream, Identification, Readers, DocState, DocProviderProps, QueryState, QueryProviderProps, DocStreamState, QueryStreamState, StreamState, ErrorViewProps, ViewerProps, DocReaderProps, QueryReaderProps, CreateReadersProps } from '../types'

export default function createReaders<Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore
}: CreateReadersProps<Doc>): Readers<Doc> {
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
  function DocReader <Requirements extends {}> ({
    DocView,
    EmptyView,
    LoadingView,
    ErrorView,
    db,
    requirements,
    getDocRef,
    children
  }: DocReaderProps<Doc, Requirements>): JSX.Element {
    const ref = getSafe({
      db,
      collectionName,
      converter,
      requirements,
      getter: getDocRef
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

  function QueryReader <Requirements extends {}> ({
    children,
    requirements,
    db,
    getQuery,
    DocView,
    EmptyView,
    LoadingView,
    ErrorView
  }: QueryReaderProps<Doc, Requirements>): JSX.Element {
    function getSafeQuery (): Query<Doc> | null {
      if (db == null) return null
      if (getQuery == null) {
        return convertCollection<Doc>({ db, collectionName, converter })
      }
      return getSafe({
        db,
        collectionName,
        converter,
        requirements,
        getter: getQuery
      })
    }

    const q = getSafeQuery()
    const stream = useCollectionData(q)
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
    DocReader,
    QueryReader,
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
