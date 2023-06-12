'use client'
import { ethers } from 'ethers';
import React, { Suspense, lazy,use,useEffect,useState } from 'react'
import { Address } from 'wagmi';
import { getInterestData } from '../../app/lib/graph/interestData';

interface Props {
  user: Address;
  amm:Address;
  symbol:string;
    
}


const MyLazyComponent = lazy(async () => await import('../countdowns/Countdown'));

const InterestData: React.FC<Props> = ({user,amm,symbol}) => {
 
  const interestData:any = use(getInterestData(amm,user));
  const[timeTillNextInterestPayment,setTimeTillNextInterestPayment] = useState<number>(0);
  const[totalAmountOwed,setTotalAmountOwed] = useState<number>(0);
  const[collateralForNextTrade,setCollateralForNextTrade] = useState<number>(0);
  // const targetDate = new Date("2023-06-06T20:24:59");
  const getInterestPayment = (loanAmt: number, interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number) => {
    return Math.floor((now - lastInterestPayed) / interestPeriod) * (loanAmt * interestRate/10**6);
}
const getMinTillPayment = (interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number)=>{
  return (now - lastInterestPayed)%interestPeriod
}
const getAllTradeInterestPayments = (trades: any, now: number) => {
  let totalInterest = 0;
  trades.forEach((trade: { tradeBalance: { interestRate: number; loanAmt: number; LastInterestPayed: number; }; ammPool: { interestPeriod: number; }; }) => {
    const { interestRate, loanAmt, LastInterestPayed } = trade.tradeBalance;
    const { interestPeriod } = trade.ammPool;
    totalInterest += getInterestPayment(loanAmt, interestRate, now, LastInterestPayed, interestPeriod);
  });
  return totalInterest;
}
const getNextInterestPaymentMinutes = (trades: any, now: number) => {
  let minTillPayment = 3600;
  let index=0;
  trades.forEach((trade: { tradeBalance: { interestRate: number; loanAmt: number; LastInterestPayed: number; }; ammPool: { interestPeriod: number; }; },i:number) => {
    const { interestRate, loanAmt, LastInterestPayed } = trade.tradeBalance;
    const { interestPeriod } = trade.ammPool;
    let thisTradeMin = getMinTillPayment(interestRate, now, LastInterestPayed, interestPeriod);
    if(thisTradeMin<minTillPayment){
      minTillPayment = thisTradeMin;
      index = i;
    }
  });
  return [minTillPayment,index];
}
useEffect(() => {
    const dateNow = new Date(Date.now());
    const [least,index] = getNextInterestPaymentMinutes(interestData.trades,Math.floor(Number(dateNow)/1000));
    setTimeTillNextInterestPayment(interestData.trades.length>0?Number(dateNow)+least*1000:Number(dateNow));
    const totalAmountOwed = getAllTradeInterestPayments(interestData.trades,Math.floor(Number(dateNow)/1000));
    setTotalAmountOwed(totalAmountOwed);
    const nextTrade =interestData.trades[index]? getInterestPayment(interestData.trades[index].tradeBalance.loanAmt,interestData.trades[index].tradeBalance.interestRate,Math.floor(Number(dateNow)/1000),interestData.trades[index].tradeBalance.LastInterestPayed,interestData.trades[index].ammPool.interestPeriod):0;
    setCollateralForNextTrade(nextTrade)

  return () => { 
      setTimeTillNextInterestPayment(0);
      setTotalAmountOwed(0);
    }
},[]);
console.log('totalAmountOwed: $',ethers.utils.formatUnits(totalAmountOwed,6));
    return (
        <div className="outside-box">
        <div className="asset-data-box inside-box">
          <h1 className='text-white'>Interest</h1>
          <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
            <p>Next Period</p>
            <div className="flex-col">
            <Suspense fallback={
              <p className="text-white text-3xl">Loading feed...</p>
            }>
              <MyLazyComponent targetDate={new Date(timeTillNextInterestPayment)} />
            </Suspense >
              <p className="text-xs text-amber-500">APROX</p>
            </div>
          </div>
          <div className="flex flex-row justify-between m-4 gap-x-12 text-xl">
            <p>Collateral Change</p>
            <div className="flex-col">
              <p>-${ethers.utils.formatUnits(collateralForNextTrade,6)}</p>
              <p className="text-xs text-amber-500 ml-6">{symbol[0].toUpperCase()}</p>
            </div>
          </div>
          <div className="flex flex-row justify-between m-4 gap-x-12 text-xl">
            <p>Total Collateral Change Each Period</p>
            <div className="flex-col">
              <p>-${ethers.utils.formatUnits(totalAmountOwed,6)}</p>
              <p className="text-xs text-amber-500 ml-6">{symbol[0].toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InterestData
