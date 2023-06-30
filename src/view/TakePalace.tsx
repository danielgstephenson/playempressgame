import { Heading } from '@chakra-ui/react'
import { SortableContext } from '@dnd-kit/sortable'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import SortableSchemesView from './SortableSchemes'

export default function TakePalaceView ({
  children,
  schemes
}: {
  children?: ReactNode
  schemes?: Scheme[]
}): JSX.Element {
  if (schemes == null) {
    return <></>
  }
  return (
    <SortableContext items={schemes}>
      <Heading size='sm'>{children}</Heading>
      <SortableSchemesView schemes={schemes} />
    </SortableContext>
  )
}
