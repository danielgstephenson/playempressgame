import { Identification } from './types'

export default function dataToFirestore <Doc extends Identification> (data: Doc): Doc {
  return data
}
