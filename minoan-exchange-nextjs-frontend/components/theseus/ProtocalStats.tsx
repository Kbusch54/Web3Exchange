import React from 'react'

interface Props {
    
}

const ProtocalStats: React.FC<Props> = () => {
    return (
        <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-red-500 to-amber-500 p-1 shadow-xl">
        <div className="block rounded-xl bg-slate-800 -z-10 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl">Protocal Stats</h1>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Total USDC Traded:</h3>
              <h3>$472,973.32</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Outstanding Debt Owned:</h3>
              <h3>$2,348.84</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Amount in Insurance Fund:</h3>
              <h3>$47,567.02</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Insurance Fund Cap:</h3>
              <h3>$50,000.00</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Cummulative DAO Earnings:</h3>
              <h3>$24,948.00</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Trader Earnings:</h3>
              <h3>$20,383.05</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Cummulative Pool Earnings:</h3>
              <h3>$36,837.00</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Total Number of Pools:</h3>
              <h3>3</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>USDC in DAO:</h3>
              <h3>$394,948.93</h3>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ProtocalStats
