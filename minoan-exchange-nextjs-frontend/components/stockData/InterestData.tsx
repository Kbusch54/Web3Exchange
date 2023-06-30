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
const costOfInterest = (loanAmt: number, interestRate: number) => {
  return Math.floor(loanAmt * interestRate/10**6);
}
const getMinTillPayment = (interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number)=>{
  now = Number(new Date(Date.now()));
  let timeAdded =(lastInterestPayed*1000);
  while(now>timeAdded){
    timeAdded+=(interestPeriod*1000) ;
  }
  let timeUnitl = timeAdded-now;
  return timeAdded;
}
const getAllTradeInterestPayments = (trades: any, now: number) => {
  let totalInterest = 0;
  trades.forEach((trade: { tradeBalance: { interestRate: number; loanAmt: number; LastInterestPayed: number; }; ammPool: { interestPeriod: number; }; }) => {
    const { interestRate, loanAmt } = trade.tradeBalance;
    totalInterest += costOfInterest(loanAmt, interestRate);
  });
  return totalInterest;
}
const getNextInterestPaymentMinutes = (trades: any, now: number) => {
  let minTillPayment:null|number = null;
  let index=0;
  trades.forEach((trade: { tradeBalance: { interestRate: number; loanAmt: number; LastInterestPayed: number; }; ammPool: { interestPeriod: number; }; },i:number) => {
    const { interestRate, loanAmt, LastInterestPayed } = trade.tradeBalance;
    const { interestPeriod } = trade.ammPool;
    let thisTradeMin = getMinTillPayment(interestRate, now, LastInterestPayed, interestPeriod);
    if(minTillPayment==null||thisTradeMin<minTillPayment){
      minTillPayment = thisTradeMin;
      index = i;
    }
  });
  if(minTillPayment==null) return [now,0];
  return [minTillPayment,index];
}
    const dateNow = new Date(Date.now());
    const [least,index] = getNextInterestPaymentMinutes(interestData.trades,Date.now());
    const timeTillNextInterestPayment=interestData.trades.length>0?Number(least):Number(dateNow)
    const totalAmountOwed = getAllTradeInterestPayments(interestData.trades,Math.floor(Number(dateNow)));
    const nextTrade =interestData.trades[index]? costOfInterest(interestData.trades[index].tradeBalance.loanAmt,interestData.trades[index].tradeBalance.interestRate):0;

    const refrsh=()=>{
      // setInterval(() => {
      //   window.location.reload();
      // }, 10000);
    }
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
              <MyLazyComponent zeroHit={refrsh} targetDate={new Date(timeTillNextInterestPayment)} />
            </Suspense >
              <p className="text-xs text-amber-500">APROX</p>
            </div>
          </div>
          <div className="flex flex-row justify-between m-4 gap-x-12 text-xl">
            <p>Collateral Change</p>
            <div className="flex-col">
              <p>-${ethers.utils.formatUnits(nextTrade,6)}</p>
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
