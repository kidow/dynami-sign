import { ReNavigation, ReTemplate } from 'components'

interface State {}

const TemplatesPage = () => {
  return (
    <div>
      <ReNavigation />
      <div className="container mx-auto">
        <div className="py-20">
          <ul className="flex flex-wrap -mx-1 md:-mx-1.5">
            <ReTemplate link="https://dynamisign.com/api/sign" />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage
