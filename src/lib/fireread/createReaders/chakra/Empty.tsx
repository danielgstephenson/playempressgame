import { Alert, AlertIcon } from '@chakra-ui/react'

export default function ChakraEmpty (): JSX.Element {
  return <Alert status='info'><AlertIcon /> No Data</Alert>
}
