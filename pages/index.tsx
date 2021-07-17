import {
  useObject,
  baseURL,
  useDebounce,
  theme,
  fileType,
  toBase64
} from 'services'
import {
  ReSEO,
  ReInput,
  ReListbox,
  ReFooter,
  ReTemplate,
  ReCopyImage,
  ReLabel
} from 'components'
import queryString from 'query-string'
import { ChangeEvent, useEffect } from 'react'
import { IItem } from 'types'
import Link from 'next/link'

interface State {
  t: string
  d: string
  thumbnail: string
  isLoading: boolean
  m: IItem
  y: IItem
  isUpdating: boolean
  url: string
  uploadFiles: File[]
  base64Files: string[]
}
let timeout = -1

const HomePage = () => {
  const [
    {
      t,
      d,
      thumbnail,
      isLoading,
      m,
      y,
      isUpdating,
      url,
      uploadFiles,
      base64Files
    },
    setState
  ] = useObject<State>({
    t: 'DynamiSign',
    d: '이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.',
    thumbnail: `${baseURL}/api/sign?d=이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.`,
    isLoading: true,
    m: theme[0],
    y: fileType[0],
    isUpdating: false,
    url: `${baseURL}/api/sign?d=이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.`,
    uploadFiles: [],
    base64Files: []
  })
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
      isUpdating: true,
      [name]: value
    })
  }
  const onThemeChange = (target: IItem) => {
    const { name } = target
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query['m'] = name
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      isUpdating: true,
      m: target
    })
  }
  const onFileTypeChange = (target: IItem) => {
    const { name } = target
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query['y'] = name
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      isUpdating: true,
      y: target
    })
  }
  const onImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      if (!input.files || input.files.length > 3) return
      const base64Files: string[] = []
      const arrayFiles = Array.from(input.files)
      for (let i = 0; i < arrayFiles.length; i++) {
        let base64file = await toBase64(arrayFiles[i])
        base64Files.push(base64file)
      }
      setState({ base64Files, uploadFiles: arrayFiles })
    }
    input.click()
  }
  const debouncedThumbnail = useDebounce<string>(thumbnail, 1000)
  useEffect(() => {
    setState({ url: debouncedThumbnail })
  }, [debouncedThumbnail])
  return (
    <>
      <ReSEO />
      <div className="container px-4 sm:px-0 mx-auto my-4 max-w-3xl">
        <ReCopyImage
          url={url}
          isLoading={isLoading}
          onLoad={() => setState({ isUpdating: false, isLoading: false })}
          isUpdating={isUpdating}
        />
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
        <ReListbox
          list={fileType}
          value={y}
          label="파일 타입 (선택)"
          onChange={onFileTypeChange}
        />
        {/* <div>
          <ReLabel>이미지 (최대 3개)</ReLabel>
          {!!base64Files.length && (
            <div className="flex my-2">
              {base64Files.map((item, key) => (
                <img key={key} src={item} className="mr-3 h-24" />
              ))}
            </div>
          )}
          <div className="flex">
            <button
              onClick={onImageUpload}
              className="px-3 py-2 bg-white shadow-md text-sm rounded-lg"
            >
              {`${!!base64Files && '재'}업로드`}
            </button>
            {!!base64Files.length && (
              <button className="ml-2 px-3 py-2 bg-white shadow-md text-sm rounded-lg">
                반영
              </button>
            )}
          </div>
        </div> */}
      </div>
      {/* <div className="container mx-auto mt-20">
        <h1 className="text-2xl mb-4 font-bold">템플릿들</h1>
        <ul className="flex flex-wrap -mx-1 md:-mx-1.5">
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
          <ReTemplate link="http://localhost:3000/api/sign" />
        </ul>
        <div className="text-center mt-4">
          <Link href="/templates">
            <button className="bg-gradient-to-r from-green-400 to-blue-500 py-2 px-5 text-white font-semibold rounded-lg">
              모든 템플릿
            </button>
          </Link>
        </div>
      </div> */}
      <ReFooter />
    </>
  )
}

export default HomePage
