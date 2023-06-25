import { Button, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import playContext from '../context/play'
import HandSchemeView from './HandScheme'
import SmallSchemeView from './SmallScheme'

export default function TrashAreaView (): JSX.Element {
  const playState = useContext(playContext)
  const { setNodeRef } = useDroppable({
    id: 'trashArea'
  })
  function handleReturn (): void {
    playState.emptyTrash?.()
  }
  const scheme = playState.trashSchemeId == null
    ? <SmallSchemeView ref={setNodeRef} />
    : <HandSchemeView id={playState.trashSchemeId} />
  return (
    <>
      <Heading size='sm'>Trash</Heading>
      {scheme}
      <Button onClick={handleReturn}>Return to hand</Button>
    </>
  )
}
