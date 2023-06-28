import { Center, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { Scheme } from '../types'
import SchemeAreaContentView from './SchemeAreaContentView'

export default function SchemeAreaView ({
  areaId,
  label,
  scheme,
  schemeId
}: {
  areaId: string
  label: string
  scheme?: Scheme
  schemeId?: string
}): JSX.Element {
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({
    id: areaId
  })
  if (gameState.phase !== 'play') {
    return <></>
  }
  return (
    <SchemeAreaContentView
      ref={setNodeRef}
      scheme={scheme}
      schemeId={schemeId}
    >
      <Center h='100%'>
        <Heading size='xs'>{label}</Heading>
      </Center>
    </SchemeAreaContentView>
  )
}
