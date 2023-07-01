import { getUserData } from 'app/lib/graph/dashboardUserData';
import React, { use } from 'react'
import { moneyFormatter } from 'utils/helpers/functions';
import { Address } from 'wagmi';

interface Props {
    user: Address
}

const Balances: React.FC<Props> = ({ user }) => {
    const userData = use(getUserData(user));
    // @ts-ignore
    const activeTrades = userData.trades ? userData.trades.filter((trade: { isActive: any; }) => trade.isActive) : 0;
    // @ts-ignore
    const cummulativeStartingCost = activeTrades ? activeTrades.reduce((a: any, b: any) => Number(a) + Number(b.startingCost), 0) : 0;
    console.log('this is userdtaa', activeTrades);
    return (
        <section className="col-span-6 md:col-span-4 lg:col-span-6 lg:mt-0 grid grid-cols-2 xl:grid-cols-3 mt-8 gap-y-2 text-white" >
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
                <h1 className=' lg:text-5xl mt-4'>{activeTrades>0?activeTrades:0}</h1>
                <h3 className='text-xs md:text-lg'> Active Trades</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
                <h1 className=' lg:text-5xl mt-4'>${cummulativeStartingCost>0?moneyFormatter(cummulativeStartingCost):'0.00'}</h1>
                <h3 className='text-xs md:text-lg'> Currently Invested</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800 m-4 bg-opacity-40'>
                <h1 className=' lg:text-5xl mt-4'>{4545}</h1>
                <h3 className='text-xs md:text-lg'>Current Active PNL</h3>
            </div>
        </section>
    )
}

export default Balances
