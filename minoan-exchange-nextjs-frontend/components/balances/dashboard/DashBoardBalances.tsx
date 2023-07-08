import React from 'react'
import { moneyFormatter } from '../../../utils/helpers/functions';
import { getPNl } from 'utils/helpers/dataMutations';

interface Props {
    userData: any
}

const DashBoardBalances: React.FC<Props> = ({ userData }) => {
    if (userData.users[0] !== undefined && userData.users[0].stakes !== undefined) {
        const cummulativeStartingCost = userData.trades ? userData.trades.reduce((a: any, b: any) => Number(a) + Number(b.startingCost), 0) : 0;
        const cummulativeStartingCostActive = userData.trades ? userData.trades.filter((trade: { isActive: any; }) => trade.isActive).reduce((a: any, b: any) => Number(a) + Number(b.startingCost), 0) : 0;
        const activeTrades = userData.trades ? userData.trades.filter((trade: { isActive: any; }) => trade.isActive) : 0;
        const totalStaked = userData.users[0] ? userData.users[0].stakes.reduce((a: any, b: any) => Number(a) + Number(b.totalStaked), 0) : 0;
        const currrentValue = (tokensOwned: number, totalTokenSupply: number, totalUsdcSupply: number) => {
            return Number(tokensOwned) / Number(totalTokenSupply) * Number(totalUsdcSupply);
        }
        const currentValueOfAllStaked = (userData: any) => {
            let total = 0;
            userData.users[0].stakes.forEach((stake: { ammPool: { poolToken: { totalSupply: number; }; poolBalance: { totalUsdcSupply: number; }; }; theseusDAO: { poolToken: { totalSupply: number, tokenBalance: [{ totalStaked: number }] }; }; tokensOwnedbByUser: number; }) => {
                if (stake.ammPool) {
                    total += currrentValue(stake.tokensOwnedbByUser, stake.ammPool.poolToken.totalSupply, stake.ammPool.poolBalance.totalUsdcSupply);
                }
                if (stake.theseusDAO) {
                    let usdcSupply = stake.theseusDAO.poolToken.tokenBalance.reduce((a: any, b: any) => Number(a) + Number(b.totalStaked), 0);
                    total += currrentValue(stake.tokensOwnedbByUser, stake.theseusDAO.poolToken.totalSupply, usdcSupply);
                }
            });
            return total;
        }
        return (
            <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${userData.users[0] ? moneyFormatter(userData.users[0].balances.availableUsdc) : 0}</h1>
                    <h3>USDC in Vault</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>{userData.trades ? userData.trades.length : 0}</h1>
                    <h3># Trades</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${cummulativeStartingCost > 0 ? moneyFormatter(cummulativeStartingCost) : 0.00}</h1>
                    <h3>USDC Invested</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>{activeTrades.length}</h1>
                    <h3># Active Trades</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${cummulativeStartingCostActive > 0 ? moneyFormatter(cummulativeStartingCostActive) : 0.00}</h1>
                    <h3>USDC Currently Invested</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${userData.users[0] ? moneyFormatter(userData.users[0].balances.totalCollateralUsdc) : 0.00}</h1>
                    <h3>Collateral</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${moneyFormatter(getPNl(userData.trades))}</h1>
                    <h3>Current PNL</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${currentValueOfAllStaked(userData) > 0 ? moneyFormatter(currentValueOfAllStaked(userData)) : 0.00}</h1>
                    <h3>USDC Staked Value</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${totalStaked > 0 ? moneyFormatter(totalStaked) : 0.00}</h1>
                    <h3>USDC Staked</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>${moneyFormatter(currentValueOfAllStaked(userData) - totalStaked)}</h1>
                    <h3>Staked PNL</h3>
                </div>
            </section>
        )
    } else {

        return (
            <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0</h1>
                    <h3>USDC</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>0</h1>
                    <h3># Investments Made</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0.00</h1>
                    <h3>USDC Currently Invested</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>0</h1>
                    <h3># Active Trades</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0.00</h1>
                    <h3>USDC Currently Invested</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0.00</h1>
                    <h3>Collateral</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$12.05</h1>
                    <h3>Current PNL</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0.00</h1>
                    <h3>USDC Staked Value</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0.00</h1>
                    <h3>USDC Staked</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1>$0.00</h1>
                    <h3>Staked PNL</h3>
                </div>
            </section>
        )
    }
}

export default DashBoardBalances
