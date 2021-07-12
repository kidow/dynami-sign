import React, { FunctionComponent } from 'react'

interface Props {}
interface State {}

const ReFooter: FunctionComponent<Props> = () => {
  return (
    <footer className="bg-white mt-36">
      <div className="container px-4 sm:px-0 mx-auto max-w-3xl">
        <div className="py-10 text-sm">
          <div className="font-semibold text-gray-800 mb-4">다이나미사인</div>
          <div className="text-gray-600">문의: contact@dynamisign.com</div>
          <div className="text-gray-600">
            © 2021 DynamiSign. All right reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ReFooter
