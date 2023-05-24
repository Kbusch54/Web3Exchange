import React from 'react'

interface Props {
    
}

const WithdrawButton: React.FC<Props> = () => {
    return (
        <div>
            <button className='px-2 py-1 rounded-2xl text-white mt-4 font-extrabold bg-amber-400 hover:scale-125'>Withdraw</button>
        </div>
    )
}

export default WithdrawButton
