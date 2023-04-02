import { Spinner } from '@chakra-ui/react'
import dataFromFirestore from '../../dataFromFirestore'
import dataToFirestore from '../../dataToFirestore'
import { FromFirestore, Identification, Readers, ToFirestore } from '../../types'
import createViewReaders from '../view'
import ChakraEmpty from './Empty'
import ChakraError from './Error'

export default function createChakraReaders <Doc extends Identification> ({
  collectionName,
  toFirestore = dataToFirestore,
  fromFirestore = dataFromFirestore
}: {
  collectionName: string
  toFirestore?: ToFirestore<Doc>
  fromFirestore?: FromFirestore<Doc>
}): Readers<Doc> {
  return createViewReaders<Doc>({
    collectionName,
    toFirestore,
    fromFirestore,
    EmptyView: ChakraEmpty,
    LoadingView: Spinner,
    ErrorView: ChakraError
  })
}
