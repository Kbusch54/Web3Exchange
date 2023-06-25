import React from 'react'

interface Props {
    
}

const Footer: React.FC<Props> = () => {
    return (
        <div className='bg-slate-900 text-gray-500 flex flex-row justify-around h-32 text-xl'>
            <p className='m-12'>@Minoan Exchange</p>
            <p className='m-12'>KDB</p>
        </div>
    )
}

export default Footer
