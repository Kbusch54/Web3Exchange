import React from 'react'

interface Props {
    
}

const PastTransactions: React.FC<Props> = () => {
    return (
        <div className=''>
            <div className='bg-transparent flex flex-row 2xl:px-64 3xl:px-0 2xl:mr-40 3xl:mr-0'>
                <p className=' w-1/2 rounded-t-2xl bg-slate-800 opacity-80 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600 inline 2xl:hidden 3xl:inline'>Past Transactions</p>
                <div className='w-[49%] text-white text-3xl  bg-[rgba(24,24,35,255)]   border-b border-gray-600 '></div>
            </div>
            <div className='hidden 2xl:block 2xl:mt-12 rounded-t-2xl 3xl:mt-0 mt-0 3xl:hidden bg-slate-800 opacity-80 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600 w-3/4'>
                <p>Past Transactions</p>
            </div>
            <div className='bg-slate-800 opacity-80 flex flex-col flex-wrap rounded-2xl rounded-tl-none border border-t-0 border-gray-600'>
                <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-1 bg-slate-700 mt-6'>
                    <div className='flex flex-row gap-x-4 items-center'>
                        <div className=' text-[2.5rem] font-extrabold logo-1 mb-1'>|</div>
                        <div className='flex flex-col text-left '>
                            <p className='text-xl'>Opened New Position</p>
                            <p className='text-sm'>12:32pm</p>
                        </div>
                    </div>
                    <div className='col-span-2 text-3xl text-right'>#</div>
                </div>
                <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-1 bg-slate-700'>
                    <div className='flex flex-row gap-x-4 items-center'>
                        <div className=' text-[2.5rem] font-extrabold text-yellow-300 mb-1'>|</div>
                        <div className='flex flex-col text-left '>
                            <p className='text-xl'>Add Collateral</p>
                            <p className='text-sm'>12:21pm</p>
                        </div>
                    </div>
                    <div className='col-span-2 text-3xl text-right'>#</div>
                </div>
                <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-1 bg-slate-700'>
                    <div className='flex flex-row gap-x-4 items-center'>
                        <div className=' text-[2.5rem] font-extrabold text-sky-300 mb-1'>|</div>
                        <div className='flex flex-col text-left '>
                            <p className='text-xl'>Propose Theseus</p>
                            <p className='text-sm'>11:22am</p>
                        </div>
                    </div>
                    <div className='col-span-2 text-3xl text-right'>#</div>
                </div>

            </div>
        </div>
    )
}

export default PastTransactions
