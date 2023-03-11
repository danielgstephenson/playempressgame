import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { FC } from 'react'
import streamFire from '.'
import { Identification, ErrorViewProps, Firestream, ViewerProps, DocStreamerProps, QueryStreamerProps } from './types'

export default function streamFireViews<Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore,
  EmptyView: DefaultEmptyView,
  LoadingView: DefaultLoadingView,
  ErrorView: DefaultErrorView
}: {
  collectionName: string
  toFirestore: (modelObject: WithFieldValue<Doc>) => DocumentData
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions) => Doc
  EmptyView?: FC
  LoadingView?: FC
  ErrorView?: FC<ErrorViewProps>
}): Firestream<Doc> {
  const firestream = streamFire<Doc>({ collectionName, toFirestore, fromFirestore })
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
    getRef,
    db,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: DocStreamerProps<Doc, Requirements>): JSX.Element {
    return (
      <firestream.DocStreamer
        requirements={requirements}
        db={db}
        getRef={getRef}
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      >
        {children}
      </firestream.DocStreamer>
    )
  }
  function QueryStreamer <Requirements extends {}> ({
    DocView,
    requirements,
    db,
    getRef,
    children,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: QueryStreamerProps<Doc, Requirements>): JSX.Element {
    return (
      <firestream.QueryStreamer
        requirements={requirements}
        db={db}
        getRef={getRef}
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      >
        {children}
      </firestream.QueryStreamer>
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
