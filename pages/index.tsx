import { useObject, baseURL } from 'services'
import { ReSEO, ReDebounceInput } from 'components'
import { Params } from 'types'
import queryString from 'query-string'

interface State extends Params {
  date: string
  thumbnail: string
}

const HomePage = () => {
  const [{ title, description, date, thumbnail }, setState] = useObject<State>({
    title: 'Dynamic Sign',
    description: 'Dynamic open graph image maker',
    date: '',
    thumbnail: `${baseURL}/api/sign`
  })
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
      <div className="container mx-auto my-4">
        <div>
          <img src={thumbnail} />
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
            onChange={(value) => onChange(value, 'description')}
          />
        </div>
      </div>
    </>
  )
}

export default HomePage
