import { ethers } from 'ethers';
import React from 'react'
import { moneyFormatter } from '../../utils/helpers/functions';

interface Props {
    poolBalances:poolBalance;
    poolToken: poolToken;
}
interface poolBalance {
    totalUsdcSupply: number;
    availableUsdc: number;
    outstandingLoanUsdc: number;
}
interface poolToken {
    tokenId: string;
    totalSupply: number;
    tokenBalance: tokenBalance[];
}
interface tokenBalance {
    tokensOwnedbByUser: number;
    totalStaked: number;
    user: user;
}
interface user {
    balances: balances;
}
interface balances {
    availableUsdc: number;
}


const Balances: React.FC<Props> = ({poolBalances,poolToken}) => {
  const currrentValue = poolToken.tokenBalance[0] !=null? poolToken.tokenBalance[0].tokensOwnedbByUser/poolToken.totalSupply* poolBalances.totalUsdcSupply:0 ;
  
    return (
        <section
        id={"balances"}
        className="col-span-6 md:col-span-4 lg:col-span-6 lg:mt-0 grid grid-cols-2 xl:grid-cols-3 mt-12 gap-y-12 text-white"
      >
        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
          <h1 className=' lg:text-5xl mt-4'>{poolToken.tokenBalance[0] !=null?(poolToken.tokenBalance[0].tokensOwnedbByUser/10**8).toFixed(4):0}</h1>
          <h3 className='text-xs md:text-lg'> Your Token Balance</h3>
        </div>
        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
          <h1 className=' lg:text-5xl mt-4'>${moneyFormatter(currrentValue)}</h1>
          <h3 className='text-xs md:text-lg'> Current Token Value</h3>
        </div>
        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
          <h1 className=' lg:text-5xl mt-4'>{Number(ethers.utils.formatUnits(poolToken.totalSupply,8)).toFixed(4)}</h1>
          <h3 className='text-xs md:text-lg'> Total Supply</h3>
        </div>
        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
          <h1 className=' lg:text-5xl mt-4'>${moneyFormatter(poolBalances.availableUsdc)}</h1>
          <h3 className='text-xs md:text-lg'> Available USDC Supply</h3>
        </div>
        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
          <h1 className=' lg:text-5xl mt-4'>${moneyFormatter(poolBalances.outstandingLoanUsdc)}</h1>
          <h3 className='text-xs md:text-lg'> Loaned Out</h3>
        </div>
        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
          <h1 className=' lg:text-5xl mt-4'>${moneyFormatter(poolBalances.totalUsdcSupply)}</h1>
          <h3 className='text-xs md:text-lg'>Total USDC Supply</h3>
        </div>
      </section>
    )
}

export default Balances
