import { CardProps, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useContext } from 'react'
import { playerContext } from '../reader/player'
import useDnd from '../use/Dnd'
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
  const { hand } = useContext(playerContext)
  const {
    attributes,
    listeners,
    setNodeRef,
    style
  } = useDnd({ id })
  // console.log('attributes', attributes)
  const scheme = hand?.find(scheme => scheme.id === id)
  if (scheme == null) {
    throw new Error(`Scheme with id ${id} not found in hand`)
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
      >
        <HandSchemeActions id={id} />
      </CollapsedSchemeView>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width='auto' onClick={onClose}>
          <ExpandedSchemeView
            rank={scheme.rank}
            onClick={onOpen}
          >
            <HandSchemeActions id={id} />
          </ExpandedSchemeView>
        </ModalContent>
      </Modal>
    </>
  )
}
