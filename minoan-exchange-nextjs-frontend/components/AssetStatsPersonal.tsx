import React, { Suspense } from 'react'
import AssetStatsTab from './tabs/dashboard/AssetStatsTab'
import { Stock } from '../types/custom'
import Image from 'next/image'
import { Address } from 'wagmi'
import LoadingState from './balances/dashboard/LoadingState'

interface Props {
    stockData: Stock,
    user:Address,
    userData:any
}

const AssetStatsPersonal: React.FC<Props> = ({ stockData,user,userData }) => {
    return (
        <div>
            <div className='flex flex-row justify-between mx-24 mt-8'>
                <div>
                    <a href={`/invest/${stockData.symbol.toLowerCase()}`}>
                        Invest
                    </a></div>
                <div className='flex flex-col'>
                    <div className='object-fill '>
                        <Image src={stockData.img} alt={"stock-img"} height={170} width={170} />
                    </div>
                    <div className='text-center'>{stockData.name}</div>
                    <div className='text-center'>{stockData.symbol}</div>
                </div>
                <div>
                    <a href={`/pools/${stockData.symbol.toUpperCase()}`}>
                        Pool</a>
                </div>
            </div>
            <div className='text-center'>
                <Suspense fallback={
                        <LoadingState />
                    }>

                    <AssetStatsTab stockData={stockData} user={user} userData={userData} />
                </Suspense>
            </div>
        </div>
    )
}

export default AssetStatsPersonal
