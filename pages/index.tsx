import { useObject, baseURL, useToast } from 'services'
import { ReSEO, ReDebounceInput } from 'components'
import { Params } from 'types'
import queryString from 'query-string'
import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'

interface State extends Params {
  date: string
  thumbnail: string
}

const HomePage = () => {
  const [{ title, description, date, thumbnail }, setState] = useObject<State>({
    title: 'DynamiSign',
    description:
      '이미지를 동적으로 만들어 주는 서비스입니다. \n이미지 클릭 시 주소가 복사됩니다.',
    date: '',
    thumbnail: `${baseURL}/api/sign`
  })
  const toast = useToast()
  const onChange = (value: string, name: string) => {
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query[name] = value
    const newURL = queryString.stringify(query, { encode: false })
    setState({ thumbnail: baseURL + '/api/sign?' + newURL })
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
            <Image
              height={600}
              width={1200}
              src={thumbnail}
              alt="sign"
              layout="responsive"
            />
          </CopyToClipboard>
        </div>
        <div>
          <ReDebounceInput
            value={title}
            name="title"
            label="타이틀"
            onChange={(value) => onChange(value, 'title')}
          />
          <ReDebounceInput
            value={description}
            name="description"
            label="설명"
            className="w-full"
            onChange={(value) => onChange(value, 'description')}
          />
        </div>
      </div>
    </>
  )
}

export default HomePage
