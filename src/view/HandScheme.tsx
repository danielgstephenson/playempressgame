import { CardProps, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { forwardRef, useContext } from 'react'
import { playerContext } from '../reader/player'
import useDnd from '../use/Dnd'
import CollapsedSchemeView from './CollapsedScheme'
import ExpandedSchemeView from './ExpandedScheme'

function View ({
  children,
  id,
  ...cardProps
}: {
  children?: React.ReactNode
  id: string
} &
CardProps,
ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hand } = useContext(playerContext)
  const {
    attributes,
    listeners,
    setNodeRef,
    style
  } = useDnd({ id })
  const scheme = hand?.find(scheme => scheme.id === id)
  if (scheme == null) {
    throw new Error(`Scheme with id ${id} not found in hand`)
  }
  return (
    <>
      <CollapsedSchemeView
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
          <ExpandedSchemeView
            rank={scheme.rank}
            onClick={onOpen}
          >
            {children}
          </ExpandedSchemeView>
        </ModalContent>
      </Modal>
    </>
  )
}
const HandSchemeView = forwardRef(View)
export default HandSchemeView
