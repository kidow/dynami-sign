import { FunctionComponent, useEffect } from 'react'
import { IModal, TUpload } from 'types'
import { ReModal } from 'components'
import { supabase, useObject, useUser } from 'services'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { imageState } from 'store'
import { CheckCircleIcon } from '@heroicons/react/solid'

interface Props extends IModal {
  onSelect: (selectedImage: string[]) => void
}
interface State {
  selectedImages: string[]
}

const ReChooseImageModal: FunctionComponent<Props> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  if (!isOpen) return null
  const [{ selectedImages }, setState] = useObject<State>({
    selectedImages: []
  })
  const { user } = useUser()
  const images = useRecoilValue(imageState)
  const setImage = useSetRecoilState(imageState)
  const fetchImages = async () => {
    if (!!images.length) return

    const { data, error } = await supabase
      .from<TUpload>('uploads')
      .select(`image_url, user_id, short_id`)
    if (error) {
      console.error(error)
      return
    }
    if (data) setImage(data.map((item) => ({ ...item, selected: false })))
  }
  const selectImage = (index: number) => {
    if (images.filter((item) => item.selected).length === 3) {
      return
    }
    updateImage(index)
  }
  const selectMyImage = (item: TUpload) => {
    const index = images.findIndex(
      (image) => image.image_url === item.image_url
    )
    updateImage(index)
  }
  const updateImage = (index: number) => {
    setImage([
      ...images.slice(0, index),
      { ...images[index], selected: !images[index].selected },
      ...images.slice(index + 1)
    ])

    const result = selectedImages
    const i = selectedImages.findIndex((url) => url === images[index].image_url)
    if (i !== -1) result.splice(i, 1)
    else result.push(images[index].image_url)
    setState({ selectedImages: result })
  }
  useEffect(() => {
    fetchImages()
  }, [])
  return (
    <ReModal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setImage(images.map((item) => ({ ...item, selected: false })))
      }}
    >
      <div className="flex justify-between">
        <span className="text-gray-900 font-bold inline-block text-lg mb-1">
          내가 올린 이미지
        </span>
        {!!selectedImages.length && (
          <button
            className="px-3 py-1 text-white bg-blue-600 font-semibold rounded-lg text-md"
            onClick={() => onSelect(selectedImages)}
          >
            반영
          </button>
        )}
      </div>
      {!!user && (
        <div className="flex flex-wrap">
          {images
            .filter((item) => item.user_id === user.id)
            .map((item, key) => (
              <div key={key} className="relative w-1/6 px-1 pb-1">
                <img
                  src={item.image_url}
                  className="w-full cursor-pointer max-h-16"
                  onClick={() => selectMyImage(item)}
                />
                {item.selected && (
                  <span className="absolute top-0 right-0 z-10">
                    <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  </span>
                )}
              </div>
            ))}
        </div>
      )}
      <div className="my-5 border-t border-gray-200" />
      <span className="text-gray-900 font-bold inline-block text-lg mb-1">
        모든 이미지
      </span>
      <div className="flex flex-wrap">
        {images.map((item, key) => (
          <div key={key} className="relative w-1/6 px-1 pb-1">
            <img
              src={item.image_url}
              className="w-full cursor-pointer max-h-16"
              onClick={() => selectImage(key)}
            />
            {item.selected && (
              <span className="absolute top-0 right-0 z-10">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
              </span>
            )}
          </div>
        ))}
      </div>
    </ReModal>
  )
}

export default ReChooseImageModal
