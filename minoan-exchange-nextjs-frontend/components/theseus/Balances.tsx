import React from 'react'
import { moneyFormatter } from 'utils/helpers/functions';

interface Props {
  data: any
}

const Balances: React.FC<Props> = ({ data }) => {
  const poolToke = data.theseusDAOs[0] ? data.theseusDAOs[0].poolToken : {
    tokenId: 0,
    totalSupply: 0,
    tokenBalance: [{ tokensOwnedbByUser: 0, totalStaked: 0 }]
  };
  const totalVaultBalance = data.balances.map((vault: { availableUsdc: number; }) => vault.availableUsdc).reduce((a: number, b: number) => Number(a) + Number(b), 0);
  const trades = data.trades;
  const activeTrades = trades.filter((trade: { isActive: boolean; startingCost:number }) => trade.isActive);
  const investedActiveTrades =activeTrades.map((trade: { startingCost: number; }) => trade.startingCost).reduce((a: number, b: number) => Number(a) + Number(b), 0);
  const totalInvested = trades.map((trade: { startingCost: number; }) => trade.startingCost).reduce((a: number, b: number) => Number(a) + Number(b), 0);
  // @ts-ignore
  const totalLoanedOut = data.vamms.map((amm) => amm.loanPool.poolBalance.outstandingLoanUsdc).reduce((a, b) => Number(a) + Number(b), 0);
    // @ts-ignore
  const totalInpools = data.vamms.map((amm) => amm.loanPool.poolBalance.totalUsdcSupply).reduce((a, b) => Number(a) + Number(b), 0);
      // @ts-ignore
      const totalAvailable = data.vamms.map((amm) => amm.loanPool.poolBalance.availableUsdc).reduce((a, b) => Number(a) + Number(b), 0);
  console.log('totalInpools', totalInpools);
  return (
    <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 3xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">{(poolToke.tokenBalance[0].tokensOwnedbByUser/10**6).toFixed(3)}</h1>
        <h3 className='text-xs md:text-lg'> Your Balance</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">{(poolToke.totalSupply/10**6).toFixed(3)}</h1>
        <h3 className='text-xs md:text-lg'> Total Supply</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">${moneyFormatter(totalInpools)}</h1>
        <h3 className='text-xs md:text-lg'>Total In LoanPools</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">${moneyFormatter(totalAvailable)}</h1>
        <h3 className='text-xs md:text-lg'>Available USDC Loan Pools</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">${moneyFormatter(totalLoanedOut)}</h1>
        <h3 className='text-xs md:text-lg'>Total Loaned Out</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">${moneyFormatter(totalVaultBalance)}</h1>
        <h3 className='text-xs md:text-lg'>Total In Vault</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$2398.63</h1>
        <h3 className='text-xs md:text-lg'>Insurance Fund</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">{trades.length}</h1>
        <h3 className='text-xs md:text-lg'>Total Trades</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">{activeTrades.length}</h1>
        <h3 className='text-xs md:text-lg'>Current Trades</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">${moneyFormatter(totalInvested)}</h1>
        <h3 className='text-xs md:text-lg'>Total Invested</h3>
      </div>
      <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
        <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">${moneyFormatter(investedActiveTrades)}</h1>
        <h3 className='text-xs md:text-lg'>Currently Invested</h3>
      </div>
    </div>
  )
}

export default Balances
