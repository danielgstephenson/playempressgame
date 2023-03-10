import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'
import { Firestream, Identification } from '.'
import streamFireViews from './views'

function EmptyAlert (): JSX.Element {
  return <Alert status='info'><AlertIcon /> No Data</Alert>
}
function ErrorAlert ({ error }: { error: Error }): JSX.Element {
  return <Alert status='error'><AlertIcon /> {error.message}</Alert>
}
export default function streamChakraFire <Doc extends Identification> (): Firestream<Doc> {
  return streamFireViews<Doc>({
    EmptyView: EmptyAlert,
    LoadingView: Spinner,
    ErrorView: ErrorAlert
  })
}
