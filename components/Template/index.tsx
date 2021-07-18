import { FunctionComponent } from 'react'
import Link from 'next/link'

interface Props {
  link: string
}
interface State {}

const ReTemplate: FunctionComponent<Props> = ({ link }) => {
  return (
    <li className="w-1/2 md:w-1/4 pb-5 md:px-1.5 px-1">
      <Link href="/templates/[id]" as="/templates/1">
        <img
          src={link}
          alt="sign"
          className="object-cover h-full w-full rounded-lg cursor-pointer"
        />
      </Link>
    </li>
  )
}

export default ReTemplate
