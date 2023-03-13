import Link from 'next/link'
import React from 'react'

interface Props {
    
}

const Header: React.FC<Props> = () => {
    return (
        <header className='p-5 bg-blue-500'>
            <Link href='/' className='bg-white p-3 '>Home</Link>
            <Link href='/todos' className='bg-white p-3 ml-4'>Todos</Link>
        </header>
    )
}

export default Header
