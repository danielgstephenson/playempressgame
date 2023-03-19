import createReaders from '.'
import { Identification, Readers as Fireshare, ViewerProps, DocReaderProps, QueryReaderProps, CreateViewReaderProps } from '../types'

export default function createViewReaders<Doc extends Identification> ({
  collectionName,
  toFirestore,
  fromFirestore,
  EmptyView: DefaultEmptyView,
  LoadingView: DefaultLoadingView,
  ErrorView: DefaultErrorView
}: CreateViewReaderProps<Doc>): Fireshare<Doc> {
  const firereader = createReaders<Doc>({ collectionName, toFirestore, fromFirestore })
  function DocViewer ({
    DocView,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: ViewerProps): JSX.Element {
    return (
      <firereader.DocViewer
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
      <firereader.QueryViewer
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      />
    )
  }

  function DocReader <Requirements extends {}> ({
    DocView,
    children,
    requirements,
    getDocRef,
    db,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: DocReaderProps<Doc, Requirements>): JSX.Element {
    return (
      <firereader.DocReader
        requirements={requirements}
        db={db}
        getDocRef={getDocRef}
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      >
        {children}
      </firereader.DocReader>
    )
  }
  function QueryReader <Requirements extends {}> ({
    DocView,
    requirements,
    db,
    getQuery,
    children,
    transformDocs,
    EmptyView = DefaultEmptyView,
    LoadingView = DefaultLoadingView,
    ErrorView = DefaultErrorView
  }: QueryReaderProps<Doc, Requirements>): JSX.Element {
    return (
      <firereader.QueryReader
        requirements={requirements}
        db={db}
        getQuery={getQuery}
        transformDocs={transformDocs}
        DocView={DocView}
        EmptyView={EmptyView}
        LoadingView={LoadingView}
        ErrorView={ErrorView}
      >
        {children}
      </firereader.QueryReader>
    )
  }
  const viewsFirestream = {
    ...firereader,
    DocViewer,
    QueryViewer,
    DocReader,
    QueryReader
  }
  return viewsFirestream
}
