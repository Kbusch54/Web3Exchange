import { getUserData } from 'app/lib/graph/dashboardUserData';
import React, { use } from 'react'
import { getPNl } from 'utils/helpers/dataMutations';
import { moneyFormatter } from 'utils/helpers/functions';
import { Address } from 'wagmi';

interface Props {
    user: Address
}
export type UserData={
    trades:{
        isActive:boolean,
        startingCost:number
        id:string
    }[]
    }



const Balances: React.FC<Props> = ({ user }) => {
    const userData:UserData  = use(getUserData(user)) as UserData;
    const activeTrades = userData.trades ? userData.trades.filter((trade: { isActive: any; }) => trade.isActive) : [];

    const cummulativeStartingCost = activeTrades ? activeTrades.reduce((a: any, b: any) => Number(a) + Number(b.startingCost), 0) : 0;

    const pnl =userData.trades? getPNl(userData?.trades):0;
    return (
        <section className="col-span-6 md:col-span-4 lg:col-span-6 lg:mt-0 grid grid-cols-2 xl:grid-cols-3 mt-8 gap-y-2 text-white" >
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
                <h1 className=' lg:text-5xl mt-4'>{activeTrades.length>0?activeTrades.length:0}</h1>
                <h3 className='text-xs md:text-lg'> Active Trades</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
                <h1 className=' lg:text-5xl mt-4'>${cummulativeStartingCost>0?moneyFormatter(cummulativeStartingCost):'0.00'}</h1>
                <h3 className='text-xs md:text-lg'> Currently Invested</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
                <h1 className=' lg:text-5xl mt-4'>${moneyFormatter(pnl)}</h1>
                <h3 className='text-xs md:text-lg'>Current PNL</h3>
            </div>
        </section>
    )
}

export default Balances
