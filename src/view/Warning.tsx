import { Alert, AlertIcon } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function Warning ({ children }: {
  children: ReactNode
}): JSX.Element {
  return (
    <Alert status='warning'>
      <AlertIcon />
      {children}
    </Alert>
  )
}
