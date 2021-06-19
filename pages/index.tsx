import { useObject, baseURL, useToast } from 'services'
import { ReSEO, ReInput } from 'components'
import { Params } from 'types'
import queryString from 'query-string'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classnames from 'classnames'
import { ChangeEvent } from 'react'

interface State extends Params {
  date: string
  thumbnail: string
  loading: boolean
}
let timeout = -1

const HomePage = () => {
  const [{ title, description, date, thumbnail, loading }, setState] =
    useObject<State>({
      title: 'DynamiSign',
      description:
        '이미지를 동적으로 만들어 주는 서비스입니다. \n이미지 클릭 시 주소가 복사됩니다.',
      date: '',
      thumbnail: `${baseURL}/api/sign`,
      loading: false
    })
  const toast = useToast()
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    window.clearTimeout(timeout)
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query[name] = value
    const newURL = queryString.stringify(query, { encode: false })
    timeout = window.setTimeout(() => setState({}), 200)
    setState({
      thumbnail: baseURL + '/api/sign?' + newURL,
      loading: true,
      [name]: value
    })
  }
  return (
    <>
      <ReSEO />
      <div className="container mx-auto my-4 max-w-3xl">
        <div className="mb-4 cursor-pointer">
          <CopyToClipboard
            text={thumbnail}
            onCopy={() => toast.success('이미지 URL이 복사되었습니다.')}
          >
            <img
              src={thumbnail}
              alt="sign"
              title="클릭해서 이미지 주소를 복사하세요."
              onLoad={() => setState({ loading: false })}
              className={classnames({
                'blur-sm': loading,
                'opacity-10': loading
              })}
              onError={() =>
                toast.error('에러가 발생했습니다. 새로고침을 해주세요.')
              }
            />
          </CopyToClipboard>
        </div>
        <div>
          <ReInput
            value={title}
            name="title"
            label="타이틀"
            onChange={onChange}
          />
          <ReInput
            value={description}
            name="description"
            label="설명"
            className="w-full"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="container mx-auto">템플릿들</div>
    </>
  )
}

export default HomePage
