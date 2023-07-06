'use client'
import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import NavLink from './NavLink'
import MenuIcon from '@mui/icons-material/Menu';
interface Props {

}


const NavButton: React.FC<Props> = () => {
  return (
    <Menu as={'div'} className={'relative'}>
      <Menu.Button className={''}><MenuIcon fontSize="large"/></Menu.Button>
      <Transition
        enter="transform transition duration-[700ms] absolute ease-in-out"
        enterFrom="opacity-100 -translate-x-20  -translate-y-64 scale-[0]"
        enterTo="opacity-100 rotate-0 -translate-x-20 translate-y-0 scale-100 absolute"
        entered='absolute z-[70] -translate-x-20 '
        leave="transform duration-[700ms] transition ease-in-out absolute"
        leaveFrom="opacity-100 scale-100 absolute -translate-x-20 translate-y-0"
        leaveTo="opacity-100  scale-[0] absolute -translate-x-20 -translate-y-64"
      >
        <Menu.Items className={'flex flex-col  bg-slate-900  text-center rounded-xl w-56 z-[60] '}>
          <Menu.Item>
            <NavLink href="/"><p className='bg-slate-900 p-3 rounded-full hover:text-slate-900 hover:bg-white '>Home</p></NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink href="/docs"><p className='bg-slate-900 p-3 rounded-full hover:text-slate-900 hover:bg-white '>Docs</p></NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink href="/theseusDao"><p className='bg-slate-900 p-3 rounded-full hover:text-slate-900 hover:bg-white'>Theseus DAO</p></NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink href="/pools"><p className='bg-slate-900 p-3 rounded-full hover:text-slate-900 hover:bg-white'>Pools</p></NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink href="/invest"><p className='bg-slate-900 p-3 rounded-full hover:text-slate-900 hover:bg-white'>Invest</p></NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink href="/dashboard"><p className='bg-slate-900 p-3 rounded-full hover:text-slate-900 hover:bg-white'>Dashboard</p></NavLink>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default NavButton
