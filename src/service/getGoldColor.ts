export default function getGoldColor ({ bg }: { bg: string }): string {
  console.log('gold bg', bg)
  switch (bg) {
    case 'gray.800': {
      return 'yellow.300'
    }
    case 'gray.100': {
      return 'yellow.900'
    }
    case 'black': {
      return 'yellow.200'
    }
    case 'gray.400': {
      return 'yellow.800'
    }
    case 'slategrey': {
      return 'yellow.100'
    }
  }
  throw new Error(`Gold background not found for ${bg}`)
}
