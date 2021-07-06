import { FunctionComponent } from 'react'
import classnames from 'classnames'
import { ReLabel } from 'components'

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
}

const ReInput: FunctionComponent<Props> = ({ label, className, ...props }) => {
  return (
    <div className="mb-4">
      {!!label && <ReLabel>{label}</ReLabel>}
      <input
        className={classnames('p-3 rounded-lg shadow-md block', className)}
        spellCheck={false}
        {...props}
      />
    </div>
  )
}

export default ReInput
