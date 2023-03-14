import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { FC } from 'react'
import firereader from './create'
import { Identification, ErrorViewProps, CollectionReaders as Fireshare, ViewerProps, DocSharerProps, QuerySharerProps } from './types'

export default function firereaderViews<Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore,
  EmptyView: DefaultEmptyView,
  LoadingView: DefaultLoadingView,
  ErrorView: DefaultErrorView
}: {
  collectionName: string
  toFirestore: (modelObject: Doc) => Doc
  fromFirestore: (snapshot: QueryDocumentSnapshot<Doc>, options?: SnapshotOptions) => Doc
  EmptyView?: FC
  LoadingView?: FC
  ErrorView?: FC<ErrorViewProps>
}): Fireshare<Doc> {
  const firestream = firereader<Doc>({ collectionName, toFirestore, fromFirestore })
  function DocViewer ({
    DocView,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: ViewerProps): JSX.Element {
    return (
      <firestream.DocViewer
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      />
    )
  }
  function QueryViewer ({
    DocView,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: ViewerProps): JSX.Element {
    return (
      <firestream.QueryViewer
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      />
    )
  }

  function DocStreamer <Requirements extends {}> ({
    DocView,
    children,
    requirements,
    getDocRef,
    db,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: DocSharerProps<Doc, Requirements>): JSX.Element {
    return (
      <firestream.DocReader
        requirements={requirements}
        db={db}
        getDocRef={getDocRef}
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      >
        {children}
      </firestream.DocReader>
    )
  }
  function QueryStreamer <Requirements extends {}> ({
    DocView,
    requirements,
    db,
    getQuery,
    children,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: QuerySharerProps<Doc, Requirements>): JSX.Element {
    return (
      <firestream.QueryReader
        requirements={requirements}
        db={db}
        getQuery={getQuery}
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      >
        {children}
      </firestream.QueryReader>
    )
  }
  const viewsFirestream = {
    ...firestream,
    DocViewer,
    QueryViewer,
    DocStreamer,
    QueryStreamer
  }
  return viewsFirestream
}
