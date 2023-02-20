import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { Transition } from '@headlessui/react'
import useClickAway from 'components/util/useClickAway'
import DarkModeToggle from 'components/widgets/DarkModeToggle'
import { useDarkMode } from 'components/util/useDarkMode'

const links = [
  // { href: "/about", title: "About" },
]

const darkIcon = (
  <svg viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" className="">
    <rect fill="#1F2937" width="64px" height="64px" x="0" y="0"></rect>
    <g transform="matrix(0.5,0,0,0.5,0,0)">
      <g transform="matrix(1,0,0,1,0,0)">
        <circle cx="64" cy="64" r="64" fill="white" stroke="#1F2937" strokeWidth="1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></circle>
        <path d="M128 128L0 0" stroke="#1F2937" strokeLinecap="square" fill="none" strokeWidth="1px" vectorEffect="non-scaling-stroke"></path>
        <path d="M30.0589 30.0589C48.804 11.3137 79.196 11.3137 97.9411 30.0589C116.686 48.804 116.686 79.196 97.9411 97.9411" stroke="#1F2937" fill="none" strokeWidth="1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></path>
        <path d="M52.6863 52.6863C58.9347 46.4379 69.0653 46.4379 75.3137 52.6863C81.5621 58.9347 81.5621 69.0653 75.3137 75.3137" stroke="#1F2937" fill="none" strokeWidth="1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></path>
        <path d="M41.3726 41.3726C53.8694 28.8758 74.1306 28.8758 86.6274 41.3726C99.1242 53.8694 99.1242 74.1306 86.6274 86.6274" stroke="#1F2937" fill="none" strokeWidth="1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></path>
      </g>
    </g>
  </svg>
)

const lightIcon = (
  <svg viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" className="">
    <rect fill="white" width="64px" height="64px" x="0" y="0"></rect>
    <g transform="matrix(0.5,0,0,0.5,0,0)">
      <g transform="matrix(1,0,0,1,0,0)">
        <circle cx="64" cy="64" r="64" fill="#1F2937" stroke="white" strokeWidth="1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></circle>
        <path d="M128 128L0 0" stroke="white" strokeLinecap="square" fill="none" strokeWidth="1.1px" vectorEffect="non-scaling-stroke"></path>
        <path d="M30.0589 30.0589C48.804 11.3137 79.196 11.3137 97.9411 30.0589C116.686 48.804 116.686 79.196 97.9411 97.9411" stroke="white" fill="none" strokeWidth="1.1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></path>
        <path d="M52.6863 52.6863C58.9347 46.4379 69.0653 46.4379 75.3137 52.6863C81.5621 58.9347 81.5621 69.0653 75.3137 75.3137" stroke="white" fill="none" strokeWidth="1.1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></path>
        <path d="M41.3726 41.3726C53.8694 28.8758 74.1306 28.8758 86.6274 41.3726C99.1242 53.8694 99.1242 74.1306 86.6274 86.6274" stroke="white" fill="none" strokeWidth="1.1px" strokeLinecap="square" vectorEffect="non-scaling-stroke"></path>
      </g>
    </g>
  </svg>
)

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useClickAway(() => setMobileMenuOpen(false))
  const [isDark, _] = useDarkMode()

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setMobileMenuOpen(false))

    return () => {
      Router.events.off('routeChangeStart', () => setMobileMenuOpen(false))
    }
  }, [])

  return (
    <header className="px-4 md:px-8 pt-6 md:pt-12">
      <nav className="border-b border-gray-200 dark:border-gray-500">
        <div className="flex flex-row justify-between items-end mx-4 lg:mx-8 -mb-px">
          <Link href="/">

            <h2 className="flex flex-row items-center text-4xl md:text-5xl pb-0.5 hover:pb-0 hover:border-b-2 dark:hover:border-white hover:border-black font-brand">
              <span className="h-6 w-6 md:h-7 md:w-7 mr-1 md:mr-2">
                {isDark && darkIcon}
                {!isDark && lightIcon}
              </span>
              evac
            </h2>

          </Link>
          <a onClick={() => setMobileMenuOpen(true)} className="hidden cursor-pointer">
            <div className="inline-block w-8 h-8 m-2">
              <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </div>
          </a>
          <ul className="flex flex-row items-baseline font-medium text-base lg:text-xl tracking-wide">
            {links.map(({href, title}) =>
              <Link href={href} key={title}>

                <li className="inline-block mx-2 lg:mx-4 px-1 py-1.5 hover:pb-1 hover:border-b-2 dark:hover:border-white hover:border-black">
                  {title}
                </li>

              </Link>
            )}
            <li className="inline-block mb-2 ml-4 h-6">
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      </nav>

      <Transition
        className="absolute top-0 inset-x-0 p-2 origin-top-right md:hidden bg-transparent"
        show={mobileMenuOpen}
        enter="transition transform ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition transform ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div ref={mobileMenuRef} className="rounded border pl-2 pr-6 py-4 -m-px dark:bg-gray-800 dark:border-gray-500 bg-white border-gray-200">
          <div className="text-right">
            <a onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
              <div className="inline-block w-8 h-8 m-2">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
            </a>
          </div>
          <ul className="uppercase font-medium text-xl">
            <Link href="/">

              <li className="mx-2 lg:mx-4 px-1 pb-3 mb-1 border-b-2">
                <h2>Home</h2>
              </li>

            </Link>
            {links.map(({href, title}) =>
              <Link href={href} key={title}>

                <li className="mx-2 lg:mx-4 px-1 py-3 border-b-2">
                  {title}
                </li>

              </Link>
            )}
          </ul>
        </div>
      </Transition>
    </header>
  );
}

export default Header

