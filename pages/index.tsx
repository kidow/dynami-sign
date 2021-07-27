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
  useToast,
  shortUrl
} from 'services'
import {
  ReSEO,
  ReInput,
  ReListbox,
  ReFooter,
  ReTemplate,
  ReCopyImage,
  ReLabel,
  ReProfile,
  ReLoginModal,
  ReSelectImageModal
} from 'components'
import queryString from 'query-string'
import { ChangeEvent, useEffect } from 'react'
import { IItem, TUpload } from 'types'
import Link from 'next/link'
import { imageState } from 'store'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import shortid from 'shortid'

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
  isLoginOpen: boolean
  isUploading: boolean
  isChooseImageOpen: boolean
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
      isLoginOpen,
      isUploading,
      isChooseImageOpen
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
    isLoginOpen: false,
    isUploading: false,
    isChooseImageOpen: false
  })
  const { user } = useUser()
  const toast = useToast()
  const images = useRecoilValue(imageState)
  const setImage = useSetRecoilState(imageState)
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
      setState({ isLoginOpen: true })
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
      if (arrayFiles.some((file) => file.size > 1024 * 1024 * 10)) {
        toast.warning('10MB 이하의 이미지만 가능합니다.')
        return
      }
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

    setState({ isUploading: true })
    const imageUrls: string[] = []
    for (let i = 0; i < uploadFiles.length; i++) {
      let file = uploadFiles[i]
      let fileName = new Date().getTime().toString()
      const upload = await supabase.storage
        .from('uploads')
        .upload(fileName, file)
      if (upload.error) {
        console.error('upload error', upload.error)
        return
      }
      const { publicURL } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)
      if (publicURL) imageUrls.push(encodeURI(publicURL))
    }
    const insert = await supabase.from<TUpload>('uploads').insert(
      Array.from({ length: uploadFiles.length }, (_, i) => ({
        user_id: user!.id,
        email: user!.email,
        file_name: uploadFiles[i].name,
        image_url: imageUrls[i],
        short_id: shortid.generate()
      }))
    )
    if (insert.error) {
      console.error('insert error', insert.error)
      return
    }
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    query['i'] = insert.data.map((item) => shortUrl(item.short_id))
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      isUploading: false,
      isUpdating: true,
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      uploadFiles: []
    })
    setImage(images.map((item) => ({ ...item, selected: false })))
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
  const onSelectImage = (selectedImages: string[]) => {
    console.log('selectedImages', selectedImages)
    const url = new URL(thumbnail).search
    const query = queryString.parse(url)
    if (query['i']) delete query['i']
    query['i'] = selectedImages.map((id) => shortUrl(id))
    const newURL = queryString.stringify(query, { encode: false })
    setState({
      isUploading: false,
      isUpdating: true,
      thumbnail: `${baseURL}/api/sign?${newURL}`,
      uploadFiles: [],
      isChooseImageOpen: false
    })
  }
  const debouncedThumbnail = useDebounce<string>(thumbnail, 1000)
  useEffect(() => {
    setState({ url: debouncedThumbnail })
  }, [debouncedThumbnail])
  return (
    <>
      <ReSEO />
      <div className="container px-4 sm:px-0 mx-auto py-4 mb-4 max-w-3xl min-h-screen">
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
          <ReLabel>
            이미지 (최대 3개)
            <span
              onClick={() => setState({ isChooseImageOpen: true })}
              className="text-gray-400 cursor-pointer ml-1"
            >
              선택
            </span>
          </ReLabel>
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
                className="ml-2 px-3 py-2 bg-white shadow-sm text-sm rounded-lg inline-flex"
                disabled={isUploading}
              >
                {!!isUploading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
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

      <ReLoginModal
        isOpen={isLoginOpen}
        onClose={() => setState({ isLoginOpen: false })}
      />
      <ReSelectImageModal
        isOpen={isChooseImageOpen}
        onClose={() => setState({ isChooseImageOpen: false })}
        onSelect={onSelectImage}
      />
      <ReProfile />
    </>
  )
}

export default HomePage
