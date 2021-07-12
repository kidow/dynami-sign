import { useObject, baseURL, useToast } from 'services'
import { ReSEO, ReInput, ReListbox, ReComment, ReFooter } from 'components'
import queryString from 'query-string'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classnames from 'classnames'
import { ChangeEvent } from 'react'
import { IItem } from 'types'

interface State {
  t: string
  d: string
  thumbnail: string
  loading: boolean
  m: IItem
}
let timeout = -1
const theme: Array<IItem> = [{ name: 'light' }, { name: 'dark' }]

const HomePage = () => {
  const [{ t, d, thumbnail, loading, m }, setState] = useObject<State>({
    t: 'DynamiSign',
    d: '이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.',
    thumbnail: `${baseURL}/api/sign?d=이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.`,
    loading: false,
    m: { name: 'light' }
  })
  const toast = useToast()
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    window.clearTimeout(timeout)
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query[name] = value
    const newURL = queryString.stringify(query, { encode: false })
    timeout = window.setTimeout(() => {}, 200)
    setState({
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      loading: true,
      [name]: value
    })
  }
  const onThemeChange = ({ name }: IItem) => {
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query['m'] = name
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      loading: true,
      m: { name }
    })
  }
  return (
    <>
      <ReSEO />
      <div className="container px-4 sm:px-0 mx-auto my-4 max-w-3xl">
        <div className="mb-4 cursor-pointer">
          <CopyToClipboard
            text={encodeURI(thumbnail)}
            onCopy={() => toast.success('이미지 URL이 복사되었습니다.')}
          >
            <img
              src={thumbnail}
              alt="sign"
              title="클릭해서 이미지 주소를 복사하세요."
              onLoad={() => setState({ loading: false })}
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
        <div>
          <ReInput
            className="w-full"
            value={t}
            name="t"
            label="타이틀"
            onChange={onChange}
          />
          <ReInput
            value={d}
            name="d"
            label="설명 (선택)"
            className="w-full"
            onChange={onChange}
          />
        </div>
        <ReListbox
          list={theme}
          value={m}
          label="테마 (선택)"
          onChange={onThemeChange}
        />
      </div>
      <div>
        <ReComment repo="kidow/dynami-sign" theme="github-light" />
      </div>
      <div className="container mx-auto">Templates</div>
      <ReFooter />
    </>
  )
}

export default HomePage
