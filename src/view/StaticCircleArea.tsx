import { Box, Heading } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import StaticCircleSchemesView from './StaticCircleSchemes'

export default function StaticCircleAreaView ({
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
      <Heading size='sm'>{label}: {children}</Heading>
      <StaticCircleSchemesView schemes={schemes} />
    </Box>
  )
}
