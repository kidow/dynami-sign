import { ReCopyImage, ReNavigation, ReSEO } from 'components'
import { useObject } from 'services'

interface State {
  isLoading: boolean
  isUpdating: boolean
}

const TemplatePage = () => {
  const [{ isLoading, isUpdating }, setState] = useObject<State>({
    isLoading: true,
    isUpdating: false
  })
  return (
    <>
      <ReSEO title="템플릿" />
      <ReNavigation maxWidth="max-w-3xl" />
      <div className="container px-4 sm:px-0 mx-auto my-4 max-w-3xl">
        <ReCopyImage
          isLoading={isLoading}
          isUpdating={isUpdating}
          onLoad={() => setState({ isLoading: false })}
          url="https://dynamisign.com/api/sign"
        />
      </div>
      <div></div>
    </>
  )
}

export default TemplatePage
