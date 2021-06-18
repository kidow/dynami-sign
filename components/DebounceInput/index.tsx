import { FunctionComponent } from 'react'
import classnames from 'classnames'
import { DebounceInput } from 'react-debounce-input'
import { ReLabel } from 'components'

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
      {!!label && <ReLabel>{label}</ReLabel>}
      <DebounceInput
        className={classnames(
          'p-3 rounded-sm shadow-sm block border border-solid border-gray-300 focus:border-gray-500',
          className
        )}
        spellCheck={false}
        debounceTimeout={1000}
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default ReDebounceInput
