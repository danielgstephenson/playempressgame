import { Card, CardBody, Heading, Modal, ModalContent, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react'
import getBg from '../service/getBg'
import ExpandedSchemeView from './ExpandedScheme'
import TinySchemeCenter from './TinySchemeCenter'

export default function TinySchemeView ({
  children,
  rank
}: {
  children?: React.ReactNode
  rank: number
}
): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bg = getBg({ rank })
  return (
    <>
      <VStack direction='column'>
        <Card
          bg={bg}
          onClick={onOpen}
          borderRadius='4px'
        >
          <CardBody p='0'>
            <TinySchemeCenter>
              <Heading size='xs' fontSize='xs'>{rank}</Heading>
            </TinySchemeCenter>
          </CardBody>
        </Card>
        {children}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width='auto' onClick={onClose}>
          <ExpandedSchemeView
            rank={rank}
          >
            {children}
          </ExpandedSchemeView>
        </ModalContent>
      </Modal>
    </>
  )
}
