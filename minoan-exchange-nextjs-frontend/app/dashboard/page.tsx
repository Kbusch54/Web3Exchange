// @ts-ignore
import React, { use, Suspense } from 'react'
import DashBoardBalances from '../../components/balances/dashboard/DashBoardBalances'
import ReachartsEx from '../../components/charts/poolCharts/ReachartsEx'
import DashBoardTradeTab from '../../components/tabs/dashboard/DashBoardTradeTab'
import DashboardAssets from '../../components/tabs/dashboard/DashboardAssets'
import { Stock } from "../../types/custom";
import { stocks } from "../utils/stockData";
import { redirect } from "next/navigation";
import RechartPie from '../../components/charts/poolCharts/recharts/RechartPie'
import RechartLines from '../../components/charts/poolCharts/recharts/RechartLines'
import RechartTinyBar from '../../components/charts/poolCharts/recharts/RechartTinyBar'
import PastTransactions from '../../components/tables/transactions/PastTransactions'
import Wallet from '../../components/dashboard/Wallet'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../utils/auth/authOptions'
import { Address } from 'wagmi'
import request, { gql } from 'graphql-request'
import { getUserData } from '../lib/graph/dashboardUserData'


interface Props {

}


export default async function page() {

    const session = await getServerSession(authOptions)
  if(!session || !session.user){
    return redirect("/auth/signin?callbackUrl=/dashboard")
  }
    const user:Address = session.user.name as Address;
    console.log('this is user',session);
    const userData = await getUserData(user);
    // console.log('this is userdtaa',userData);
    return (
        <div className='mx-4 flex flex-col gap-y-4 '>
            <h1 className='text-white'>Dashboard</h1>
            <DashBoardBalances userData={userData} />
            <div className='grid grid-cols-12'>
                <div className='col-span-3 px-8'>
                    <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300'>
                        <p className='text-white text-3xl text-center pt-4'>Investments</p>
                    </div>
                    <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
                    <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none'>
                        <RechartPie />

                    </div>
                </div>
                <div className='col-span-5 grid grid-cols-6 gap-x-4'>
                    <div className='col-span-2 self-center'>
                        <div className='flex flex-row justify-between bg-slate-800 rounded-2xl px-4 my-4'>
                            <p className='text-white text-3xl text-center p-4'>PNL</p>
                            <button className='text-white text-3xl text-center p-4'>d</button>
                        </div>
                        <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                            <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                                <p className=''>Earnings</p>
                                <p className='text-amber-400 text-lg'>+$200.77</p>
                            </div>
                            <RechartTinyBar height={270} />
                        </div>
                    </div>
                    <div className='col-span-4 mt-24 border border-slate-800 flex flex-col h-fit rounded-xl'>
                        <p className='text-white text-xl text-center pt-4'>Trading History</p>
                        <RechartLines height={300} />
                    </div>
                </div>
                <div className='col-span-4 mx-12 flex flex-col  '>
                    <Wallet user={user} />
                    <PastTransactions />

                </div>
            </div>





            <div className='mx-4 md:mx-8 lg:mx-24 xl:mx-40 border-2 border-slate-700 mt-12'>
                {/* <Suspense fallback={<div>Loading...</div>}>
                </Suspense> */}
                <RechartLines height={800} /> 
            </div>

            <DashBoardTradeTab user={user}  />

            {stocks && (
                <DashboardAssets userData={userData} stockData={stocks} user={user} />
                
            )}
        </div>
    )
}
