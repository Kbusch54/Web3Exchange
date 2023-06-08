import { ethers,utils } from 'ethers';
import React from 'react'

interface Props {
    loanPool: loanPool;
}
interface loanPool {
    id: string;
    created: string;
    minLoan: number;
    maxLoan: number;
    interestRate: number;
    interestPeriod: number;
    mmr: number;
    minHoldingsReqPercentage: number;
    tradingFee: number;
}

const InvestorStats: React.FC<Props> = ({loanPool}) => {
    return (
        <div className="outside-box">
        <div className="inside-box">
          <div className="flex flex-col gap-y-4 gap-x-12">
            <h1 className='text-white text-center'>Investor Stats</h1>
            <div className='flex flex-row gap-x-12 lg:gap-x-24 text-md md:text-lg text-center justify-between text-white'>
              <h3>Minimum Margin Ratio:</h3>
              <h3>{utils.formatUnits(loanPool.mmr,4)}%</h3>
            </div>
            <div className='flex flex-row gap-x-12 lg:gap-x-24 text-lg text-center justify-between text-white'>
              <h3>Max Leverage:</h3>
              <h3>15X</h3>
            </div>
            <div className='flex flex-row gap-x-12 lg:gap-x-24 text-lg text-center justify-between text-white'>
              <h3>Minimum Investment:</h3>
              <h3>${utils.formatUnits(loanPool.minLoan,6)}</h3>
            </div>
            <div className='flex flex-row gap-x-12 lg:gap-x-24 text-lg text-center justify-between text-white'>
              <h3>Maximum Investment:</h3>
              <h3>${utils.formatUnits(loanPool.maxLoan,6)}</h3>
            </div>
            <div className='flex flex-row gap-x-12 lg:gap-x-24 text-lg text-center justify-between text-white'>
              <h3>Interest Rate:</h3>
              <h3>{utils.formatUnits(loanPool.interestRate,4)}%</h3>
            </div>
            <div className='flex flex-row gap-x-12 lg:gap-x-24 text-lg text-center justify-between text-white'>
              <h3>Interest Payment Period:</h3>
              <h3>{loanPool.interestPeriod/3600}hrs</h3>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InvestorStats
