import { FunctionComponent } from 'react'
import classnames from 'classnames'
import { DebounceInput } from 'react-debounce-input'

interface Props {
  className?: string
  label: string
  value: string
  onChange: (value: string) => void
  name: string
}

const ReDebounceInput: FunctionComponent<Props> = ({
  label,
  className,
  value,
  name,
  onChange
}) => {
  return (
    <div className="mb-4">
      {!!label && <label className="block">{label}</label>}
      <DebounceInput
        className={classnames('p-3 rounded-sm shadow-sm', className)}
        spellCheck={false}
        debounceTimeout={1500}
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default ReDebounceInput
