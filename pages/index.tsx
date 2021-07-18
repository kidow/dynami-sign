import {
  useObject,
  baseURL,
  useDebounce,
  theme,
  fileType,
  toBase64,
  basicImage,
  supabase,
  useUser,
  useToast
} from 'services'
import {
  ReSEO,
  ReInput,
  ReListbox,
  ReFooter,
  ReTemplate,
  ReCopyImage,
  ReLabel,
  ReModal,
  ReProfile
} from 'components'
import queryString from 'query-string'
import { ChangeEvent, useEffect } from 'react'
import { IItem } from 'types'
import Link from 'next/link'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { authState } from 'store'

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
  isOpen: boolean
  isUploading: boolean
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
      base64Files,
      isOpen,
      isUploading
    },
    setState
  ] = useObject<State>({
    t: '다이나미사인',
    d: '이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.',
    thumbnail: `${baseURL}/api/sign?d=이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.&i=${basicImage}`,
    isLoading: true,
    m: theme[0],
    y: fileType[0],
    isUpdating: false,
    url: `${baseURL}/api/sign?d=이미지를 동적으로 만들어 주는 서비스입니다. 이미지 클릭 시 주소가 복사됩니다.&i=${basicImage}`,
    uploadFiles: [],
    base64Files: [basicImage],
    isOpen: false,
    isUploading: false
  })
  const { user } = useUser()
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
    if (!user) {
      setState({ isOpen: true })
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      if (!input.files) return
      if (input.files.length > 3) {
        toast.warning('이미지는 최대 3개입니다.')
        return
      }
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
  const onApplyImages = async () => {
    if (!confirm('반영하시겠습니까?')) return
    if (isUploading) return

    setState({ isUpdating: true })
    const imageUrls: string[] = []
    for (let i = 0; i < uploadFiles.length; i++) {
      let file = uploadFiles[i]
      const { error } = await supabase.storage
        .from('uploads')
        .upload(file.name, file)
      const { publicURL } = supabase.storage
        .from('uploads')
        .getPublicUrl(file.name)
      if (publicURL) imageUrls.push(encodeURI(publicURL))
      if (error) {
        console.error(error)
        return
      }
    }
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query['i'] = imageUrls
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      isUploading: false,
      isUpdating: true,
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      uploadFiles: []
    })
  }
  const onClearImages = () => {
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    delete query['i']
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      uploadFiles: [],
      base64Files: [],
      isUpdating: true,
      thumbnail: `${baseURL}/api/sign?${newURL}`
    })
  }
  const onSignIn = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signIn({
      provider
    })
    if (error) {
      console.error(error)
    }
  }
  const debouncedThumbnail = useDebounce<string>(thumbnail, 1000)
  useEffect(() => {
    setState({ url: debouncedThumbnail })
  }, [debouncedThumbnail])
  return (
    <>
      <ReSEO />
      <div className="container px-4 sm:px-0 mx-auto py-4 mb-4 max-w-3xl">
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
        <div>
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
              className="px-3 py-2 bg-white shadow-sm text-sm rounded-lg"
            >
              업로드
            </button>
            {!!uploadFiles.length && (
              <button
                onClick={onApplyImages}
                className="ml-2 px-3 py-2 bg-white shadow-sm text-sm rounded-lg"
              >
                반영
              </button>
            )}
            {!!base64Files.length && (
              <button
                className="ml-2 px-3 py-2 bg-white shadow-sm text-sm rounded-lg"
                onClick={onClearImages}
              >
                제거
              </button>
            )}
          </div>
        </div>
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

      <ReModal isOpen={isOpen} onClose={() => setState({ isOpen: false })}>
        <div className="text-center">
          <div className="text-lg">
            로그인 시 <b>이미지 업로드</b>가 가능합니다.
          </div>
          <div className="border-t bg-gray-400 my-4" />
          <div className="flex items-center">
            <button
              onClick={() => onSignIn('github')}
              className="text-center flex-1 flex justify-center border border-gray-200 rounded-md py-1"
            >
              <AiFillGithub className="w-7 h-7" />
            </button>
            <div className="px-2" />
            <button
              onClick={() => onSignIn('google')}
              className="text-center flex-1 flex justify-center border border-gray-200 rounded-md py-1"
            >
              <FcGoogle className="w-7 h-7" />
            </button>
          </div>
        </div>
      </ReModal>
      <ReProfile />
    </>
  )
}

export default HomePage
