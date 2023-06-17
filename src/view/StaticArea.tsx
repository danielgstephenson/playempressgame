import { Heading } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import StaticSchemesView from './StaticSchemes'

export default function StaticAreaView ({
  label,
  children,
  schemes
}: {
  label: string
  children?: ReactNode
  schemes?: Scheme[]
}): JSX.Element {
  return (
    <>
      <Heading size='sm'>{label}: {children}</Heading>
      <StaticSchemesView schemes={schemes} />
    </>
  )
}
