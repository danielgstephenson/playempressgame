import { FC } from 'react'
import streamFire from '.'
import { Identification, ErrorViewProps, Firestream, ViewerProps, DocStreamerProps, QueryStreamerProps } from './types'

export default function streamFireViews<Doc extends Identification> ({
  EmptyView: DefaultEmptyView,
  LoadingView: DefaultLoadingView,
  ErrorView: DefaultErrorView
}: {
  EmptyView?: FC
  LoadingView?: FC
  ErrorView?: FC<ErrorViewProps>
}): Firestream<Doc> {
  const firestream = streamFire<Doc>()
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
  function DocStreamer <Needs extends {}> ({
    DocView,
    children,
    refNeeds,
    getRef,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: DocStreamerProps<Doc, Needs>): JSX.Element {
    return (
      <firestream.DocStreamer
        refNeeds={refNeeds}
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
  function QueryStreamer <Needs extends {}> ({
    DocView,
    refNeeds,
    getRef,
    children,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: QueryStreamerProps<Doc, Needs>): JSX.Element {
    return (
      <firestream.QueryStreamer
        refNeeds={refNeeds}
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
