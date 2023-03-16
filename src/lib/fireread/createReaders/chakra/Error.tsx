import { Alert, AlertIcon } from '@chakra-ui/react'

export default function ChakraError ({ error }: { error: Error }): JSX.Element {
  return <Alert status='error'><AlertIcon /> {error.message}</Alert>
}
