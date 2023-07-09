import React, { Suspense } from 'react'
import AssetStatsTab from './tabs/dashboard/AssetStatsTab'
import { Stock } from '../types/custom'
import Image from 'next/image'
import { Address } from 'wagmi'

interface Props {
    stockData: Stock,
    user:Address,
    userData:any
}

const AssetStatsPersonal: React.FC<Props> = ({ stockData,user,userData }) => {
    return (
        <div>
            <div className='flex flex-row justify-between mx-24 md:mx-40 lg:mx-56 xl:mx-72 mt-8'>
                <button className='px-4 py-2 rounded-2xl h-12 bg-slate-900 border border-amber-400 m-2 hover:scale-125 md:text-lg lg:text-xl xl:text-2xl'>
                    <a href={`/invest/${stockData.symbol.toLowerCase()}`}>
                        Invest
                    </a></button>
                <div className='flex flex-col my-8'>
                    <div className='object-fill '>
                        <Image src={stockData.img} alt={"stock-img"} height={170} width={170} />
                    </div>
                    <div className='text-center'>{stockData.symbol}</div>
                </div>
                <button className='px-4 py-2 rounded-2xl h-12 bg-slate-900 border border-amber-400 m-2 hover:scale-125 md:text-lg lg:text-xl xl:text-2xl'>
                    <a href={`/pools/${stockData.symbol.toUpperCase()}`}>
                        Pool</a>
                </button>
            </div>
            <div className='text-center'>

                    <AssetStatsTab stockData={stockData} user={user} userData={userData} />

            </div>
        </div>
    )
}

export default AssetStatsPersonal
