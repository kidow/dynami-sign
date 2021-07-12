import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import { MaxWidth } from 'types'

interface Props {
  maxWidth?: MaxWidth
}
interface State {}

const ReNavigation: FunctionComponent<Props> = ({ maxWidth = 'container' }) => {
  return (
    <nav className="sticky top-0 border-b border-gray-100 shadow-sm">
      <div className={`mx-auto px-4 h-12 flex items-center ${maxWidth}`}>
        <div>
          <Link href="/">
            <img src="/media/logo.svg" className="h-6 mt-0.5 cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default ReNavigation
