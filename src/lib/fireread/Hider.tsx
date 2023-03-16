import { Stream, HiderProps } from './types'
import Viewing from './Viewing'

export default function Hider <Data, Snapshot, Firestream extends Stream<Data, Snapshot>> ({
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
