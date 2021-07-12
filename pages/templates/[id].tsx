import { ReCopyImage, ReNavigation, ReSEO } from 'components'
import { useObject } from 'services'

interface State {
  loading: boolean
}

const TemplatePage = () => {
  const [{ loading }, setState] = useObject<State>({ loading: false })
  return (
    <>
      <ReSEO />
      <ReNavigation maxWidth="max-w-3xl" />
      <div className="container px-4 sm:px-0 mx-auto my-4 max-w-3xl">
        <ReCopyImage
          loading={loading}
          onLoad={() => setState({ loading: false })}
          url="https://dynamisign.com/api/sign"
        />
      </div>
      <div></div>
    </>
  )
}

export default TemplatePage
