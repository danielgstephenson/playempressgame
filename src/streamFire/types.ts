import { FirestoreError, DocumentSnapshot, QuerySnapshot, DocumentReference, Query } from 'firebase/firestore'
import { FC, ReactNode } from 'react'

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
