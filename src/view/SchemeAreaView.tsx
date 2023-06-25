import { Box, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { Scheme } from '../types'
import SchemeAreaContentView from './SchemeAreaContentView'

export default function SchemeAreaView ({
  scheme,
  schemeId,
  areaId,
  label
}: {
  scheme?: Scheme
  schemeId?: string
  areaId: string
  label: string
}): JSX.Element {
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({
    id: areaId
  })
  if (gameState.phase !== 'play') {
    return <></>
  }
  return (
    <Box w='19%'>
      <Heading size='sm'>{label}</Heading>
      <SchemeAreaContentView
        ref={setNodeRef}
        scheme={scheme}
        schemeId={schemeId}
      />
    </Box>
  )
}
