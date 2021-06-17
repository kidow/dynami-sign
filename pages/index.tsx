import { useObject, baseURL } from 'services'
import { ReInput, ReSEO } from 'components'
import { Metapo } from 'types'

interface State extends Metapo {
  date: string
  thumbnail: string
}

const HomePage = () => {
  const [{ title, description, date, thumbnail }, setState, onChange] =
    useObject<State>({
      title: 'WSL2 Failed to complete request socket hang up',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae nihil optio incidu...',
      date: '',
      thumbnail: ''
    })
  return (
    <>
      <ReSEO />
      <div className="container mx-auto">
        <div>Dynami Sign</div>
        <div>
          <img src={`${baseURL}/sign`} />
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
            onChange={onChange}
          />
        </div>
      </div>
    </>
  )
}

export default HomePage
