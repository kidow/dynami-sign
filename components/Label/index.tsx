import React, { FunctionComponent } from 'react'

interface Props {}

const ReLabel: FunctionComponent<Props> = ({ children }) => {
  return (
    <label className="inline-block text-sm mb-1 font-semibold">
      {children}
    </label>
  )
}

export default ReLabel
