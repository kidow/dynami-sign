import { ReNavigation, ReSEO } from 'components'
import Link from 'next/link'

interface State {}

const NotFoundPage = () => {
  return (
    <>
      <ReSEO title="404" noSEO />
      <ReNavigation maxWidth="max-w-3xl" />
      <div className="max-w-3xl mx-auto">
        <div className="my-4 text-center">
          <h1 className="text-6xl font-bold">404</h1>
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

export default NotFoundPage
