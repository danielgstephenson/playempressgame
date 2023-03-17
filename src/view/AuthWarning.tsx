import { Alert, AlertIcon } from '@chakra-ui/react'

export default function AuthWarning (): JSX.Element {
  return (
    <Alert status='warning'>
      <AlertIcon />
      You are not signed in yet.
    </Alert>
  )
}
