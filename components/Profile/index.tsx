import { Menu, Transition } from '@headlessui/react'
import { HandIcon, LogoutIcon } from '@heroicons/react/outline'
import React, { Fragment, FunctionComponent } from 'react'
import { supabase, useUser } from 'services'

interface Props {}
interface State {}

const ReProfile: FunctionComponent<Props> = () => {
  const { user, resetUser } = useUser()
  if (!user) return null
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
      return
    }
    resetUser()
  }
  const onResign = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return null
    try {
      await fetch('/api/resign', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ uid: user.id })
      })
      resetUser()
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <Menu as="div" className="fixed top-5 right-5">
      <Menu.Button className="w-10 h-10 rounded-full shadow-md">
        <img src={user.user_metadata.avatar_url} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1">
            <div className="p-2 text-gray-500">
              @{user.user_metadata.full_name}
            </div>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onLogout}
                  className={`${
                    active ? 'bg-gray-100' : 'bg-white'
                  } flex rounded-md items-center w-full p-2 text-sm`}
                >
                  <LogoutIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  로그아웃
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onResign}
                  className={`${
                    active ? 'bg-red-50 text-red-600' : 'text-red-500'
                  } flex rounded-md items-center w-full p-2 text-sm`}
                >
                  <HandIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  탈퇴
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ReProfile
