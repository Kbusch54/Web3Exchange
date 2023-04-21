'use client'
import React, { Suspense, lazy } from 'react'

interface Props {
    
}

const MyLazyComponent = lazy(async () => await import('../countdowns/Countdown'));

const InterestData: React.FC<Props> = () => {
  const targetDate = new Date("2023-04-22T20:24:59");
    return (
        <div className="outside-box  row-span-3">
        <div className="asset-data-box inside-box">
          <h1 className='text-white'>Interest</h1>
          <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
            <p>Next Period</p>
            <div className="flex-col">
            <Suspense fallback={
              <p className="text-white text-3xl">Loading feed...</p>
            }>
              <MyLazyComponent targetDate={targetDate} />
            </Suspense >
              <p className="text-xs text-amber-500">APROX</p>
            </div>
          </div>
          <div className="flex flex-row justify-between m-4 gap-x-12 text-xl">
            <p>Total Collateral Change</p>
            <div className="flex-col">
              <p>- $13.29</p>
              <p className="text-xs text-amber-500 ml-6">TSLA</p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InterestData
