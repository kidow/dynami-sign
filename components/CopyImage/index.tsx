import { FunctionComponent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classnames from 'classnames'
import { useToast } from 'services'

interface Props {
  loading: boolean
  url: string
  onLoad: () => void
}
interface State {}

const ReCopyImage: FunctionComponent<Props> = ({ loading, url, onLoad }) => {
  const toast = useToast()
  return (
    <div className="mb-4 cursor-pointer">
      <CopyToClipboard
        text={encodeURI(url)}
        onCopy={() => toast.success('이미지 URL이 복사되었습니다.')}
      >
        <img
          src={url}
          alt="sign"
          title="클릭해서 이미지 주소를 복사하세요."
          onLoad={onLoad}
          className={classnames('shadow-md hover:shadow-lg', {
            'blur-sm': loading,
            'opacity-40': loading
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
