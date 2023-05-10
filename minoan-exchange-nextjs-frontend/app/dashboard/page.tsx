import React, { Suspense } from 'react'
import DashBoardBalances from '../../components/balances/dashboard/DashBoardBalances'
import ReachartsEx from '../../components/charts/poolCharts/ReachartsEx'
import DashBoardTradeTab from '../../components/tabs/dashboard/DashBoardTradeTab'
import DashboardAssets from '../../components/tabs/dashboard/DashboardAssets'
import { Stock } from "../../types/custom";
import { stocks } from "../utils/stockData";
import { getServerSession } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Props {

}

export default async function page  () {
    
    const session = await getServerSession();
    if(!session) {
        redirect(`/auth/signin?callbackUrl=/dashboard`);
    }
    console.log('session from dashboard',session);
    return (
        <div className='mx-4 flex flex-col gap-y-4'>
            <h1 className='text-white'>Dashboard</h1>
            <DashBoardBalances />
            <div className='mx-4 md:mx-8 lg:mx-24 xl:mx-40 border-2 border-slate-700 mt-12'>
                <Suspense fallback={<div>Loading...</div>}>
                    <ReachartsEx />
                </Suspense>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <DashBoardTradeTab />
            </Suspense>
            {stocks && (
                <Suspense fallback={<div>Loading...</div>}>
                    <DashboardAssets stockData={stocks} />
                </Suspense>
            )}
        </div>
    )
}
