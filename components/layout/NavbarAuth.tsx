'use client'

import { useAuth } from '@/providers/auth'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function NavbarAuth() {
  const { user, isAdmin } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Sign in
      </Link>
    )
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
        <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {isAdmin && (
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/admin"
                  className={`
                    block px-4 py-2 text-sm
                    ${active ? 'bg-gray-100' : ''}
                    ${isAdmin ? 'text-gray-900' : 'text-gray-700'}
                  `}
                >
                  Admin Dashboard
                </Link>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`
                  block w-full px-4 py-2 text-left text-sm text-gray-700
                  ${active ? 'bg-gray-100' : ''}
                `}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 