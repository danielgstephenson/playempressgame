import { CardProps, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import useDndSortable from '../use/DndSortable'
import CollapsedSchemeView from './CollapsedScheme'
import ExpandedSchemeView from './ExpandedScheme'
import HandSchemeActions from './HandSchemeActions'

export default function HandSchemeView ({
  active,
  id,
  ...cardProps
}: {
  active?: boolean
  id: string
} & CardProps
): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hand } = useContext(playContext)
  const {
    attributes,
    listeners,
    setNodeRef,
    style
  } = useDndSortable({ id })
  if (hand == null) {
    return <></>
  }
  const scheme = hand.find(scheme => scheme.id === id)
  if (scheme == null) {
    console.error('hand', hand)
    console.error('id', id)
    return <>x</>
    // throw new Error(`Scheme with id ${id} not found in hand`)
  }
  return (
    <>
      <CollapsedSchemeView
        active={active}
        onClick={onOpen}
        rank={scheme.rank}
        size='sm'
        id={id}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        {...cardProps}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width='auto' onClick={onClose}>
          <ExpandedSchemeView rank={scheme.rank}>
            <HandSchemeActions id={id} />
          </ExpandedSchemeView>
        </ModalContent>
      </Modal>
    </>
  )
}
