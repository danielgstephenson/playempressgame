import { createContext, useContext, ReactNode, FC } from 'react'
import { DocumentReference, DocumentSnapshot, FirestoreError, Query, QuerySnapshot } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

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
export type DocState <Doc> = { doc?: Doc } & Partial<Doc>
export interface ErrorViewProps {
  error: FirestoreError
}
export interface HiderViews {
  EmptyView?: FC
  LoadingView?: FC
  ErrorView?: FC<ErrorViewProps>
}
export interface ViewerProps extends HiderViews {
  DocView: FC
}
export interface StreamerProps extends ViewerProps {
  children?: ReactNode
}
export interface DocStreamerProps <Doc> extends StreamerProps {
  docRef?: DocumentReference<Doc>
}
export interface QueryStreamerProps <Doc> extends StreamerProps {
  queryRef?: Query<Doc>
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
export interface HiderProps <Stream> extends HiderViews {
  streamState: StreamState<Stream>
  children: ReactNode
}
export interface Firestream <Doc> {
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
}

export interface ViewProp <Props> {
  View?: FC<Omit<ViewAndProps<Props>, 'View'>>
}
export type ViewAndProps <Props> = ViewProp<Props> & Props
export function Viewing <Props> (props: ViewAndProps<Props>): JSX.Element {
  if (props.View == null) return <></>
  const { View, ...viewProps } = props
  return <props.View {...viewProps} />
}
export function Hider <Data, Snapshot, Firestream extends Stream<Data, Snapshot>> ({
  streamState,
  children,
  EmptyView,
  LoadingView,
  ErrorView
}: HiderProps<Firestream>): JSX.Element {
  if (streamState.stream == null) return <></>
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

export default function streamFire<Doc extends Identification> (): Firestream<Doc> {
  const docContext = createContext<DocState<Doc>>({})

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
  const queryContext = createContext<QueryState<Doc>>({})

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

  function Viewer <Data, Snapshot, Firestream extends Stream<Data, Snapshot>> ({ children, streamState, EmptyView, LoadingView, ErrorView }: {
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

  function QueryViewer ({ DocView, EmptyView, LoadingView, ErrorView }: ViewerProps): JSX.Element {
    const queryStreamState = useContext(queryStreamContext)
    return (
      <Viewer streamState={queryStreamState} EmptyView={EmptyView} LoadingView={LoadingView} ErrorView={ErrorView}>
        <QueryView DocView={DocView} EmptyView={EmptyView} />
      </Viewer>
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

  function DocStreamer ({
    docRef,
    DocView,
    EmptyView,
    LoadingView,
    ErrorView,
    children
  }: DocStreamerProps<Doc>): JSX.Element {
    const stream = useDocumentData(docRef)
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

  function QueryStreamer ({
    children,
    queryRef,
    DocView,
    EmptyView,
    LoadingView,
    ErrorView
  }: QueryStreamerProps<Doc>): JSX.Element {
    const stream = useCollectionData(queryRef)
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
