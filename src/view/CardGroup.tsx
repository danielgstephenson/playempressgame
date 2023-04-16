import { Heading } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import CardGroupContentView from './CardGroupContent'

export default function CardGroupView ({
  label,
  children,
  cardGroup
}: {
  label: string
  children?: ReactNode
  cardGroup?: Scheme[]
}): JSX.Element {
  console.log('label', label)
  console.log('cardGroup', cardGroup)
  return (
    <>
      <Heading size='sm'>{label}: {children}</Heading>
      <CardGroupContentView cardGroup={cardGroup} />
    </>
  )
}
