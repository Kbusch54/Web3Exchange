import { getTransactions } from 'components/forms/buttons/helper/database'
import React, { use } from 'react'
import EtherscanLogo from '../utils/EtherscanLogo'

interface Props {
    user: string

}

const PastTransactions: React.FC<Props> = ({ user }) => {
    const dbData = use(getTransactions(user))
    const typeClass = (type: string) => {
        if (type == "vault") {
            return 'font-extrabold text-yellow-300 bg-yellow-200  shadow-xl shadow-yellow-200 mb-1'
        } else if (type == "trade") {
            return 'font-extrabold text-sky-300 bg-sky-200  shadow-xl shadow-sky-200 mb-1'
        } else {
            return 'font-extrabold text-green-300 bg-green-200  shadow-xl shadow-green-200 mb-1'
        }
    }
    if (dbData) {
        return (
            <div className=''>
                <div className='bg-transparent flex flex-row 2xl:px-64 3xl:px-0 2xl:mr-40 3xl:mr-0 '>
                    <p className=' w-1/2 rounded-t-2xl bg-slate-800 opacity-80 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600 inline 2xl:hidden 3xl:inline'>Past Transactions</p>
                    <div className='w-[49%] text-white text-3xl  bg-[rgba(24,24,35,255)]   border-b border-gray-600 '></div>
                </div>
                <div className='hidden 2xl:block 2xl:mt-12 rounded-t-2xl 3xl:mt-0 mt-0 3xl:hidden bg-slate-800 opacity-80 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600 w-3/4'>
                    <p>Past Transactions</p>
                </div>

                <div className='bg-slate-800 opacity-80 flex flex-col flex-wrap rounded-2xl rounded-tl-none border border-t-0 border-gray-600 '>
                    <div className='mb-6'></div>
                    {dbData.map((data) => {
                        return (
                            <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-2 bg-slate-700 '>
                                <div className='flex flex-row gap-x-4 items-center'>
                                    <div className={` text-[2.5rem] ${typeClass(data.type)} `}>|</div>
                                    <div className='flex flex-col text-left '>
                                        <p className='text-xl'>{data.name}</p>
                                        <p className='text-sm'>{data.timestamp.slice(0,-10)}</p>
                                    </div>
                                </div>
                                <div className='col-span-2 text-3xl text-right'>
                                    <EtherscanLogo txHash={data.transactionHash} />
                                </div>
                            </div>
                        )
                    })}
                    <div className='mb-2'></div>
                </div>
            </div>

        )
    } else {
        return (<></>)
    }
}

export default PastTransactions
