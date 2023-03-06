import { createContext, useContext, ReactNode, FC } from 'react'
import { FirestoreError, Query, QuerySnapshot } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'

export default function streamQuery<Doc extends { id?: string }> ({ View }: {
  View?: FC<Doc>
}): {
    Streamer: FC<{ queryRef?: Query<Doc>, children?: ReactNode }>
    Viewer: FC
    streamContext: React.Context<{
      stream?: [Doc[] | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Doc> | undefined]
      docs?: Doc[]
      loading?: Boolean
      error?: FirestoreError
    }>
    docsContext: React.Context<{ docs?: Doc[] }>
    DocsProvider: FC<{ docs?: Doc[], children: ReactNode }>
  } {
  interface DocsState {
    docs?: Doc[]
  }
  const docsContext = createContext<DocsState>({})

  function DocsProvider ({
    docs,
    children
  }: {
    docs?: Doc[]
    children: ReactNode
  }): JSX.Element {
    const state: DocsState = { docs }

    return (
      <docsContext.Provider value={state}>
        {children}
      </docsContext.Provider>
    )
  }

  type Stream = [Doc[] | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Doc> | undefined]

  interface StreamState {
    stream?: Stream
    docs?: Doc[]
    loading?: Boolean
    error?: FirestoreError
  }

  const streamContext = createContext<StreamState>({})

  function Viewer (): JSX.Element {
    const streamState = useContext(streamContext)
    if (streamState.stream == null) return <></>
    const [data, loading, error] = streamState.stream
    if (loading) {
      return <Spinner />
    }
    if (error != null) {
      return <Alert status='error'><AlertIcon /> {error.message}</Alert>
    }
    if (data == null) {
      return <></>
    }
    if (data.length === 0) {
      return <Alert status='info'><AlertIcon />No Data</Alert>
    }
    const items = View != null && data.map(datum => (
      <View
        key={datum.id}
        {...datum}
      />
    ))
    return <>{items}</>
  }

  function Streamer ({
    queryRef,
    children
  }: {
    queryRef?: Query<Doc>
    children?: ReactNode
  }): JSX.Element {
    const stream = useCollectionData(queryRef)
    const [docs, loading, error] = stream
    const state: StreamState = {
      stream,
      docs,
      loading,
      error
    }
    return (
      <streamContext.Provider value={state}>
        <DocsProvider docs={docs}>
          {children}
          <Viewer />
        </DocsProvider>
      </streamContext.Provider>
    )
  }

  return {
    Streamer,
    Viewer,
    docsContext,
    streamContext,
    DocsProvider
  }
}
