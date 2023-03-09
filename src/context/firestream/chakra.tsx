import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'
import { DocumentReference, Query } from 'firebase/firestore'
import { FC, ReactNode } from 'react'
import firestream, { Firestream, Identification } from '.'

interface ChakraViewerProps {
  DocView: FC
  children?: ReactNode
}
interface ChakaraDocStreamerProps <Doc> extends ChakraViewerProps {
  docRef?: DocumentReference<Doc>
}
interface ChakaraQueryStreamerProps <Doc> extends ChakraViewerProps {
  queryRef?: Query<Doc>
}
interface ChakraFirestream<Doc> extends Firestream<Doc> {
  DocViewer: FC<ChakraViewerProps>
  QueryViewer: FC<ChakraViewerProps>
  DocStreamer: FC<ChakraViewerProps & { docRef?: DocumentReference<Doc> }>
  QueryStreamer: FC<ChakraViewerProps & { queryRef?: Query<Doc> }>
}
export default function chakraFirestream<Doc extends Identification> (): ChakraFirestream<Doc> {
  const streaming = firestream<Doc>()
  function EmptyView (): JSX.Element {
    return <Alert status='info'><AlertIcon /> No Data</Alert>
  }
  function ErrorView ({ error }: { error: Error }): JSX.Element {
    return <Alert status='error'><AlertIcon /> {error.message}</Alert>
  }
  const hiderViews = {
    EmptyView,
    LoadingView: Spinner,
    ErrorView
  }
  const chakraStreaming = {
    ...streaming,
    DocViewer: function ChakraDocViewer ({ DocView }: ChakraViewerProps): JSX.Element {
      return <streaming.DocViewer DocView={DocView} {...hiderViews} />
    },
    QueryViewer: function ChakraQueryViewer ({ DocView }: ChakraViewerProps): JSX.Element {
      return <streaming.QueryViewer DocView={DocView} {...hiderViews} />
    },
    DocStreamer: function ChakraDocStreamer ({ DocView, docRef }: ChakaraDocStreamerProps<Doc>): JSX.Element {
      return <streaming.DocStreamer DocView={DocView} docRef={docRef} {...hiderViews} />
    },
    QueryStreamer: function ChakraQueryStreamer ({ DocView, queryRef }: ChakaraQueryStreamerProps<Doc>): JSX.Element {
      return <streaming.QueryStreamer DocView={DocView} queryRef={queryRef} {...hiderViews} />
    }
  }
  return chakraStreaming
}
