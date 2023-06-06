'use client'
import { ethers } from 'ethers';
import request, { gql } from 'graphql-request';
// @ts-ignore
import React, { Suspense, lazy,use,useEffect,useState } from 'react'
import { Address } from 'wagmi';

interface Props {
  user: Address;
  amm:Address;
    
}
async function fetchInterestData(ammPoolId: string, user: string) {
  const query = gql` 
      query getTradeData($user: String!, $ammPoolId: String!) {
    trades(where:{
      user: $user,
      ammPool:$ammPoolId
      
    }) {
      tradeBalance {
        interestRate
        loanAmt
        LastInterestPayed
      }
      ammPool{
        interestPeriod
      }
    }
  }
   
  `;
  const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
  const variables = { ammPoolId: ammPoolId, user: user };
  const data = await request(endpoint, query, variables);

  return data;
}

const MyLazyComponent = lazy(async () => await import('../countdowns/Countdown'));

const InterestData: React.FC<Props> = ({user,amm}) => {
  const interestData = use(fetchInterestData(amm,user));
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
// const least = getNextInterestPaymentMinutes(interestData.trades,Math.floor(Date.now()/1000));
// console.log('least',least);
// console.log('date now',Date.now());
// // const targetDate = new Date(Date.now()+least*1000);
// console.log('date after',Date.now()+least*1000);
// const dateNow = new Date(Date.now());
// const dateAfter = new Date(Date.now()+least*1000);
// const dateDiff = dateAfter.getTime() - dateNow.getTime();
// console.log('dateDiff',dateDiff);
// 1686086088681-1686086004681=82000
useEffect(() => {
 
    const dateNow = new Date(Date.now());
    const [least,index] = getNextInterestPaymentMinutes(interestData.trades,Math.floor(Number(dateNow)/1000));
    setTimeTillNextInterestPayment(Number(dateNow)+least*1000);
    const totalAmountOwed = getAllTradeInterestPayments(interestData.trades,Math.floor(Number(dateNow)/1000));
    setTotalAmountOwed(totalAmountOwed);
    const nextTrade = getInterestPayment(interestData.trades[index].tradeBalance.loanAmt,interestData.trades[index].tradeBalance.interestRate,Math.floor(Number(dateNow)/1000),interestData.trades[index].tradeBalance.LastInterestPayed,interestData.trades[index].ammPool.interestPeriod);
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
              <p className="text-xs text-amber-500 ml-6">TSLA</p>
            </div>
          </div>
          <div className="flex flex-row justify-between m-4 gap-x-12 text-xl">
            <p>Total Collateral Change Each Period</p>
            <div className="flex-col">
              <p>-${ethers.utils.formatUnits(totalAmountOwed,6)}</p>
              <p className="text-xs text-amber-500 ml-6">TSLA</p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InterestData
