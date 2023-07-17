'use client'
import React, { useState } from 'react'
import { Stock } from '../../../types/custom';

import AsstsStatsPersonal from '../../AssetStatsPersonal';
import { Address } from 'wagmi';

interface Props {
    stockData: Stock[],
    user: Address
    userData: any
}

const DashboardAssets: React.FC<Props> = ({ stockData,user,userData }) => {
    const [activeAsset, setActiveAsset] = useState(1);
    //change every 5 seconds
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (activeAsset < stockData.length - 1) {
    //             setActiveAsset(activeAsset + 1);
    //         } else {
    //             setActiveAsset(0);
    //         }
    //     }, 5000);
    //     return () => clearInterval(interval);
    // }, [activeAsset]);

    const handleNext = () => {
        if (activeAsset < stockData.length - 1) {
            setActiveAsset(activeAsset + 1);
        } else {
            setActiveAsset(0);
        }
    };
    const handlePrevious = () => {
        if (activeAsset > 0) {
            setActiveAsset(activeAsset - 1);
        } else {
            setActiveAsset(stockData.length - 1);
        }
    };




    return (
        <div className='m-4 border-2 border-slate-600 flex flex-col text-white relative '>
            <div className='flex flex-row  justify-between text-3xl'>
                <button className='left-2 top-20 absolute' onClick={handlePrevious}>Prev</button>
                <button className='right-2 top-20 absolute' onClick={handleNext}>Next</button>
            </div>
            <AsstsStatsPersonal stockData={stockData[activeAsset]} user={user} userData={userData} />
        </div>
    )
}

export default DashboardAssets
