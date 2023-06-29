import { Box, Heading } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import TinySchemesView from './TinySchemes'

export default function TinySchemeAreaView ({
  label,
  children,
  schemes
}: {
  label: string
  children?: ReactNode
  schemes?: Scheme[]
}): JSX.Element {
  return (
    <Box>
      <Heading size='sm'>{label} {children}</Heading>
      <TinySchemesView schemes={schemes} />
    </Box>
  )
}
