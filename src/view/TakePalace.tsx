import { Box, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import EmptySmallSchemeView from './EmptySmallScheme'
import SortableSchemesView from './SortableSchemes'

export default function TakePalaceView ({
  children,
  emptied,
  id,
  over,
  schemes
}: {
  children?: ReactNode
  emptied: boolean
  id: string
  over?: boolean
  schemes?: Scheme[]
}): JSX.Element {
  const { setNodeRef } = useDroppable({ id })
  if (schemes == null) {
    return <></>
  }
  const content = emptied
    ? <EmptySmallSchemeView ref={setNodeRef} />
    : <SortableSchemesView schemes={schemes} />
  const fontWeight = over === true ? '1000' : undefined
  return (
    <SortableContext items={schemes}>
      <Box flexGrow='1'>
        <Heading size='sm' fontWeight={fontWeight}>{children}</Heading>
        {content}
      </Box>
    </SortableContext>
  )
}
