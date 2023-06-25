import { Button, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import playContext from '../context/play'
import SmallSchemeView from './SmallScheme'
import TrashSchemeView from './TrashScheme'

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
    : <TrashSchemeView id={playState.trashSchemeId} />
  return (
    <>
      <Heading size='sm'>Trash</Heading>
      {scheme}
      <Button onClick={handleReturn}>Return to hand</Button>
    </>
  )
}
