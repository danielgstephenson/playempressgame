export default function getSilverColor ({ bg }: { bg: string }): string {
  switch (bg) {
    case 'gray.800': {
      return 'gray.300'
    }
    case 'gray.100': {
      return 'gray.600'
    }
    case 'black': {
      return 'gray.300'
    }
    case 'gray.400': {
      return 'gray.700'
    }
    case 'slategrey': {
      return 'gray.400'
    }
  }
  throw new Error(`Silver background not found for ${bg}`)
}
