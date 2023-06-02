import React from 'react'

interface Props {
    handleSelection: (e: React.MouseEvent<HTMLButtonElement>) => void
    
}

const TheseusButtonSelection: React.FC<Props> = ({handleSelection}) => {
    return (
        <div className='flex  flex-wrap justify-center gap-5 text-md xl:text-lg text-center text-white pb-12 px-4 '>
        <button id='internal' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Theseus Functions</button>
        <button id='exchange' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Exchange</button>
        <button id='loanPool' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Loan Pool</button>
        <button id='ammViewer' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Amm Viewer</button>
        <button id='ariadne' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Create Ariadne</button>
        <button id='staking' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Staking</button>
        <button id='usdc' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>USDC</button>
        <button id='custom' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Custom</button>
    </div>
    )
}

export default TheseusButtonSelection
