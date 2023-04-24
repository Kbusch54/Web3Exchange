import React from 'react'
import AssetStatsTab from './tabs/dashboard/AssetStatsTab'
import { Stock } from '../types/custom'
import Image from 'next/image'

interface Props {
    stockData: Stock
}

const AssetStatsPersonal: React.FC<Props> = ({stockData}) => {
    return (
        <div>
        <div className='flex flex-row justify-between mx-24 mt-8'>
            <div>
                <a href={`/invest/${stockData.symbol.toUpperCase()}`}>
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
                <a href={`/pools/${stockData.slug}`}>
                    Pool</a>
                    </div>
        </div>
        <div className='text-center'>

            <AssetStatsTab stockData={stockData} />
        </div>
    </div>
    )
}

export default AssetStatsPersonal
