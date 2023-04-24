import React from 'react'
import DashBoardBalances from '../../components/balances/dashboard/DashBoardBalances'
import ReachartsEx from '../../components/charts/poolCharts/ReachartsEx'
import DashBoardTradeTab from '../../components/tabs/dashboard/DashBoardTradeTab'
import DashboardAssets from '../../components/tabs/dashboard/DashboardAssets'
import { Stock } from "../../types/custom";
import { stocks } from "../utils/stockData";

interface Props {

}

const page: React.FC<Props> = () => {
    return (
        <div className='mx-4 flex flex-col gap-y-4'>
            <h1 className='text-white'>Dashboard</h1>
            <DashBoardBalances />
            <div className='mx-4 md:mx-8 lg:mx-24 xl:mx-40 border-2 border-slate-700 mt-12'>
                <ReachartsEx />
            </div>
            <DashBoardTradeTab/>
            {stocks&&(
                <DashboardAssets stockData={stocks}/>
                )}
        </div>
    )
}

export default page
