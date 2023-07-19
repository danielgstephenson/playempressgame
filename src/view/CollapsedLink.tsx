import { Link } from 'react-router-dom'
import LinkIconView from './LinkIcon'

export default function CollapsedLinkView ({
  icon,
  link
}: {
  icon: string
  link: string
}): JSX.Element {
  return (
    <Link to={link} target='_blank' onClick={(event) => event.stopPropagation()}>
      <LinkIconView src={icon} />
    </Link>
  )
}
