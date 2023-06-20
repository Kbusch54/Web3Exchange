'use client'
import React, { useState } from 'react'
import SelectType from './options/selectTypeOptions';
import ReachartLines from '../charts/poolCharts/recharts/RechartLines';
import RechartPie from '../charts/poolCharts/recharts/RechartPie';
import { Address } from 'wagmi';
import { getTardeSidesByAmm, getTradeHistory } from 'utils/helpers/dataMutations';

interface Props {
    poolData: any
    user: Address
}

const TypeSelection: React.FC<Props> = ({poolData,user}) => {
    const [type, setType] = useState<string>('pool');
    const handleChange = (newType: string) => {
        setType(prevState => newType)
    }
    const poolBalances = poolData.vamms[0].loanPool.poolBalance;
    const trades = poolData.trades;
    const poolDataForPie = [
        { name: 'Available USDC', value: Number(poolBalances.availableUsdc)/10**6 },
        { name: 'Outstanding Loan USDC', value: Number(poolBalances.outstandingLoanUsdc)/10**6 },
    ]
    const pieDataForTrading = getTardeSidesByAmm(trades,poolData.vamms[0].loanPool.id);
    const lineDataForTrading = getTradeHistory(trades,undefined,poolData.vamms[0].loanPool.id);

    return (
        <div className='flex flex-col justify-center self-center'>
            <div>
                <SelectType changeType={handleChange} typeSelectedParent={type} />
            </div>
            {type === 'pool' && (
                <div className="grid grid-cols-7 lg:grid-cols-12 gap-x-8  items-center">
                    <div className='col-span-7 flex-col inline-flex'>
                        <div>
                            {/* <ReachartLines height={400} /> */}
                        </div>
                        <div className='flex flex-row justify-around pt-10'>
                            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                                <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                                <h3 className='text-xs md:text-lg'> Avg. Stake</h3>
                            </div>
                            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                                <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                                <h3 className='text-xs md:text-lg'> Your Avg Stake</h3>
                            </div>
                            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                                <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                                <h3 className='text-xs md:text-lg'> Last Stake</h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-7 lg:col-span-5 items-center '>
                        <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300'>
                            <p className='text-white text-3xl text-center pt-4'>USDC In Pool</p>
                        </div>
                        <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
                        <div className='bg-slate-800 flex flex-col justify-center rounded-2xl rounded-tl-none text-lg'>
                            <RechartPie dataForPie={poolDataForPie}  toolTipLabel='$'/>

                        </div>
                    </div>
                </div>
            )}
            {type === 'trading' && (
                <div className="grid grid-cols-7 lg:grid-cols-12 gap-x-8  items-center">
                <div className='col-span-7 flex-col inline-flex'>
                    <div>
                        <ReachartLines height={400} lineData={lineDataForTrading} />
                    </div>
                    <div className='flex flex-row justify-around pt-10'>
                        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                            <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                            <h3 className='text-xs md:text-lg'>Avg Loan Amt</h3>
                        </div>
                        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                            <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                            <h3 className='text-xs md:text-lg'>Avg Trading Time</h3>
                        </div>
                        <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                            <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                            <h3 className='text-xs md:text-lg'>Avg Pnl</h3>
                        </div>
                    </div>
                </div>
                <div className='col-span-7 lg:col-span-5 items-center '>
                    <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300'>
                        <p className='text-white text-3xl text-center pt-4'>Trading Sides</p>
                    </div>
                    <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
                    <div className='bg-slate-800 flex flex-col justify-center rounded-2xl rounded-tl-none text-lg'>
                        <RechartPie dataForPie={pieDataForTrading}/>

                    </div>
                </div>
            </div>
            )}
            {type === 'proposal' && (
                  <div className="grid grid-cols-7 lg:grid-cols-12 gap-x-8  items-center">
                  <div className='col-span-7 flex-col inline-flex'>
                      <div>
                          {/* <ReachartLines height={400} /> */}
                      </div>
                      <div className='flex flex-row justify-around pt-10'>
                          <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                              <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                              <h3 className='text-xs md:text-lg'>Proposals</h3>
                          </div>
                          <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                              <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                              <h3 className='text-xs md:text-lg'>Avg # Signers</h3>
                          </div>
                          <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                              <h1 className=' lg:text-5xl mt-4'>${20}</h1>
                              <h3 className='text-xs md:text-lg'>Avg Proposal time</h3>
                          </div>
                      </div>
                  </div>
                  <div className='col-span-7 lg:col-span-5 items-center '>
                      <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300'>
                          <p className='text-white text-3xl text-center pt-4'>Executed v.s. Failed</p>
                      </div>
                      <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
                      <div className='bg-slate-800 flex flex-col justify-center rounded-2xl rounded-tl-none text-lg'>
                          <RechartPie />
  
                      </div>
                  </div>
              </div>
            )}

        </div>
    )
}

export default TypeSelection
