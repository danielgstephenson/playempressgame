import { Heading, HStack, Stack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { Scheme } from '../types'
import EmptySmallSchemeView from './EmptySmallScheme'

export default function TakePalaceView ({
  children,
  emptied,
  id,
  label,
  over,
  schemes
}: {
  children?: ReactNode
  emptied: boolean
  id: string
  label: JSX.Element | string
  over?: boolean
  schemes?: Scheme[]
}): JSX.Element {
  const { setNodeRef } = useDroppable({ id })
  if (schemes == null) {
    return <></>
  }
  const content = emptied
    ? <EmptySmallSchemeView ref={setNodeRef} />
    : children
  const fontWeight = over === true ? '1000' : undefined
  return (
    <Stack flexGrow='1' spacing='4px'>
      <Heading size='sm' fontWeight={fontWeight}>
        <HStack width='max-content' alignItems='baseline'>
          {label}
        </HStack>
      </Heading>
      {content}
    </Stack>
  )
}
