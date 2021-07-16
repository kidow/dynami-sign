import { FunctionComponent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classnames from 'classnames'
import { useToast } from 'services'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { ClipLoader } from 'react-spinners'

interface Props {
  isLoading: boolean
  url: string
  onLoad: () => void
  isUpdating: boolean
}
interface State {}

const ReCopyImage: FunctionComponent<Props> = ({
  isLoading,
  url,
  onLoad,
  isUpdating
}) => {
  const toast = useToast()
  return (
    <div className="mb-4 cursor-pointer relative">
      {isUpdating && (
        <div className="absolute left-1/2 top-1/2 -ml-6 -mt-6 z-10 flex items-center justify-center">
          <ClipLoader size={48} color="rgb(209, 213, 219)" />
        </div>
      )}
      {isLoading && <div className="md:h-96 sm:h-44 bg-white shadow-md"></div>}
      <CopyToClipboard
        text={encodeURI(url)}
        onCopy={() => toast.success('이미지 URL이 복사되었습니다.')}
      >
        <LazyLoadImage
          src={url}
          effect="blur"
          alt="sign"
          title="클릭해서 이미지 주소를 복사하세요."
          onLoad={onLoad}
          className={classnames('shadow-md hover:shadow-lg', {
            'blur-sm': isUpdating,
            'opacity-40': isUpdating
          })}
          onError={() =>
            toast.error('에러가 발생했습니다. 새로고침을 해주세요.')
          }
        />
      </CopyToClipboard>
    </div>
  )
}

export default ReCopyImage
