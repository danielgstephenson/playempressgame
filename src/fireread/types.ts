import { FirestoreError, DocumentSnapshot, QuerySnapshot, DocumentReference, Query, Firestore, CollectionReference } from 'firebase/firestore'
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
export type Safe<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
}
export interface StreamerProps <Requirements extends {}> extends ViewerProps {
  children?: ReactNode
  requirements?: Requirements
  db: Firestore | undefined
}
export interface GetterProps <Doc, Requirements extends {}> {
  collectionRef: CollectionReference<Doc>
  requirements: Safe<Requirements>
}
export type DocRefGetter <Doc, Requirements extends {}> = (props: GetterProps<Doc, Requirements>) => DocumentReference<Doc>
export type QueryGetter <Doc, Requirements extends {}> = (props: GetterProps<Doc, Requirements>) => Query<Doc>
export interface DocSharerProps <Doc, Requirements extends {}>
  extends StreamerProps<Requirements> {
  getDocRef: DocRefGetter<Doc, Requirements>
}
export interface QuerySharerProps <Doc, Requirements extends {}>
  extends StreamerProps<Requirements> {
  getQuery?: QueryGetter<Doc, Requirements>
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

export type DocStreamerComponent <Doc> = <Requirements extends {}> (
  props: DocSharerProps<Doc, Requirements>
) => JSX.Element
export type QueryStreamerComponent <Doc> = <Requirements extends {}> (
  props: QuerySharerProps<Doc, Requirements>
) => JSX.Element
export interface Readers <Doc> {
  DocReader: DocStreamerComponent<Doc>
  QueryReader: QueryStreamerComponent<Doc>
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
  View?: FC<JustProps<Props>>
}
export type ViewAndProps <Props> = ViewProp<Props> & Props
export type JustProps <Props> = Omit<ViewAndProps<Props>, 'View'>