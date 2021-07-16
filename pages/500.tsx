import { ReNavigation, ReSEO } from 'components'
import Link from 'next/link'

interface State {}

const ErrorPage = () => {
  return (
    <>
      <ReSEO title="500" noSEO />
      <ReNavigation maxWidth="max-w-3xl" />
      <div className="max-w-3xl mx-auto">
        <div className="my-4 text-center">
          <h1 className="text-6xl font-bold">500</h1>
          <p className="text-3xl my-4">죄송합니다. 에러가 발생했습니다.</p>
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

export default ErrorPage
