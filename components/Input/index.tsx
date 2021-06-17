import { FunctionComponent } from 'react'

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
}

const ReInput: FunctionComponent<Props> = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      {!!label && <label>{label}</label>}
      <input
        className="p-3 rounded-sm shadow-sm w-full"
        spellCheck={false}
        {...props}
      />
    </div>
  )
}

export default ReInput
