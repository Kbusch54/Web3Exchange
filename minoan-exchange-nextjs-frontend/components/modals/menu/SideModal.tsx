'use client'
import { useState } from 'react'
import { Transition } from '@headlessui/react'
import Wallet from '../../dashboard/Wallet'
import { stocks } from '../../../app/utils/stockData'
import helmet from "@assets/silhoute-helmet.png"
import Image from 'next/image';
import {usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react'
import { Address } from 'wagmi'
import PastTransactions from 'components/tables/transactions/PastTransactions'
import Balances from 'components/balances/sidemodal/Balances'
interface Props {

}

const SideModal: React.FC<Props> = () => {
    const session = useSession()

    const user:Address = session.data?.user?.name as  Address
    let [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname();
    function closeModal() {
        setIsOpen(false)
    }

    function handleModal() {
        setIsOpen(isOpen => !isOpen)
    }
    if(!session || session.status == 'unauthenticated'){
        return null
    }
    if(pathname == '/docs' || pathname == '/'||pathname.includes('/auth')){
        return null
    }
    return (
        <div className={`text-white`}>
            <div className="fixed top-1/2 flex items-center justify-left z-[70]">
                <button
                    type="button"
                    onClick={handleModal}
                    className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    Open dialog
                </button>
            </div>


            <div className={` text-center inline-block fixed top-0 z-50 overflow-auto h-full no-scrollbar `}>

                <Transition appear show={isOpen} as={'div'}
                    enter="ease-out transform transition duration-[700ms]"
                    enterFrom="opacity-0 -translate-x-60"
                    enterTo="opacity-100 translate-x-0"
                    leave="ease-in transform transition duration-[700ms]"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 -translate-x-60">
                    <div className='   '>
                        <div className=' bg-slate-900 ring-opacity-80 bg-opacity-90 text-white  flex flex-col justify-center text-center   max-w-xs md:max-w-md lg:max-w-lg xl:max-w-full relative  pt-4'>
                            {user&&(

                                <Wallet user={user} />
                            )}
                            <a href='/invest'
                                
                            >
                               <Balances user={user} />
                              
                            </a>
                            <PastTransactions user={user} limit={3} />
                        
                            <div className='text-white text-center my-12  m-12 md:mx-24'>
                                <h1 className='text-5xl mb-4'>Ariadne Pools</h1>
                                <div className='flex flex-wrap  items-center gap-12 '>
                                    {stocks.map(stock => (
                                        <div key={stock.slug} className='pool-card w-full md:w-1/2 lg:w-1/2 xl:w-1/2 3xl:w-1/3 4xl:w-1/4'>
                                            <a href={`/pools/${stock.symbol}`}>

                                                <div className='flex flex-row justify-between relative'>
                                                    <Image src={helmet} alt={'helmet'} width={120} height={400} />
                                                    <div className='mr-2 relative'>
                                                        <p className="absolute -top-[4.45rem] right-12 text-green-500 text-8xl animate-pulse">.</p>
                                                        Active
                                                    </div>
                                                    <p className='text-lg absolute left-1/3 text-left'>{stock.symbol}</p>
                                                </div>
                                                <div className='m-auto block max-w-max h-24 '>
                                                    <Image src={stock.img} alt={'stock-img'} width={70} height={70} className='' /></div>
                                                <h1 className='text-3xl mb-8'>{stock.name}</h1>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>

                </Transition>

            </div>
        </div>
    )
}

export default SideModal
