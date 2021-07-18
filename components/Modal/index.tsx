import { FunctionComponent } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}
interface State {}

const ReModal: FunctionComponent<Props> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black opacity-30 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 py-5 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default ReModal
