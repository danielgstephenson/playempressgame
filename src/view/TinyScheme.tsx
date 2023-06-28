import { Card, CardBody, Center, Heading, Modal, ModalContent, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react'
import getBg from '../service/getBg'
import ExpandedSchemeView from './ExpandedScheme'

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
        >
          <CardBody p='.05vw' sx={{ aspectRatio: '3/4' }}>
            <Center w='18px' minH='24px'>
              <Heading size='xs' fontSize='xs'>{rank}</Heading>
            </Center>
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
