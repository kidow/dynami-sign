import { FunctionComponent } from 'react'
import { ReModal } from 'components'
import { IModal } from 'types'
import { supabase } from 'services'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'

interface Props extends IModal {}
interface State {}

const ReLoginModal: FunctionComponent<Props> = ({ isOpen, onClose }) => {
  const onSignIn = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signIn({
      provider
    })
    if (error) {
      console.error(error)
    }
  }
  return (
    <ReModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="text-lg">
          로그인 시 <b>이미지 업로드</b>가 가능합니다.
        </div>
        <div className="border-t bg-gray-400 my-4" />
        <div className="flex items-center">
          <button
            onClick={() => onSignIn('github')}
            className="text-center flex-1 flex justify-center border border-gray-200 rounded-md py-1"
          >
            <AiFillGithub className="w-7 h-7" />
          </button>
          <div className="px-2" />
          <button
            onClick={() => onSignIn('google')}
            className="text-center flex-1 flex justify-center border border-gray-200 rounded-md py-1"
          >
            <FcGoogle className="w-7 h-7" />
          </button>
        </div>
        <div className="mt-4 text-sm">
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            개인정보처리방침
          </a>
        </div>
      </div>
    </ReModal>
  )
}

export default ReLoginModal
