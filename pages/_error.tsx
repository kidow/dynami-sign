import { ReNavigation, ReSEO } from 'components'
import { NextPageContext } from 'next'
import Link from 'next/link'
import { FunctionComponent } from 'react'

interface Props {
  statusCode: number
}
interface State {}

const ErrorPage: FunctionComponent<Props> = ({ statusCode }) => {
  return (
    <>
      <ReSEO title={String(statusCode)} noSEO />
      <ReNavigation maxWidth="max-w-3xl" />
      <div className="max-w-3xl mx-auto">
        <div className="my-4 text-center">
          <h1 className="text-6xl font-bold">{statusCode}</h1>
          <p className="text-3xl my-4">존재하지 않는 페이지입니다.</p>
          <Link href="/">
            <button className="bg-gradient-to-r from-green-400 to-blue-500 py-2 px-5 text-white font-semibold rounded-lg">
              홈으로
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

// @ts-ignore
ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage
