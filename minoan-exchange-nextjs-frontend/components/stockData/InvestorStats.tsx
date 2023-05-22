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
  console.log(loanPool)
    return (
        <div className="outside-box">
        <div className="inside-box">
          <div className="asset-info-box">
            <h1 className='text-white text-center'>Investor Stats</h1>
            <div>
              <h3>Minimum Margin Ratio:</h3>
              <h3>{utils.formatUnits(loanPool.mmr,4)}%</h3>
            </div>
            <div>
              <h3>Max Leverage:</h3>
              <h3>15X</h3>
            </div>
            <div>
              <h3>Minimum Investment:</h3>
              <h3>${utils.formatUnits(loanPool.minLoan,6)}</h3>
            </div>
            <div>
              <h3>Maximum Investment:</h3>
              <h3>${utils.formatUnits(loanPool.maxLoan,6)}</h3>
            </div>
            <div>
              <h3>Interest Rate:</h3>
              <h3>{utils.formatUnits(loanPool.interestRate,4)}%</h3>
            </div>
            <div>
              <h3>Interest Payment Period:</h3>
              <h3>{loanPool.interestPeriod/3600}hrs</h3>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InvestorStats
