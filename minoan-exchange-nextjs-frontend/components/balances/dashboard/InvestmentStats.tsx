import React from 'react'
import { Address } from 'wagmi'
import { getAmmId } from '../../../utils/helpers/doas'
import { moneyFormatter } from '../../../utils/helpers/functions'

interface Props {
    symbol:string,
    userTrades:any
}

const InvestmentStats: React.FC<Props> = ({symbol,userTrades}) => {
    const stockID = getAmmId(symbol)
    const tradesWhereAmmPool = userTrades.filter((trade:any)=>trade.ammPool.id.toLowerCase() === stockID.toLowerCase())
    const activeTrades = tradesWhereAmmPool.filter((trade:any)=>trade.isActive == true)
    const totalCollateral = tradesWhereAmmPool.reduce((acc:any,trade:any)=>Number(acc)+Number(trade.tradeBalance.collateral),0)
    const cummulativeStartingCost = tradesWhereAmmPool.reduce((acc:any,trade:any)=>Number(acc)+Number(trade.startingCost),0)
    const investedActive = activeTrades.reduce((acc:any,trade:any)=>Number(acc)+Number(trade.startingCost),0)
    return (
        <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6  mt-12 gap-y-6 gap-x-6 text-white">

            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>${cummulativeStartingCost?moneyFormatter(cummulativeStartingCost):0.00}</h1>
                <h3>Cummulative USDC Invested </h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>{tradesWhereAmmPool?tradesWhereAmmPool.length:0}</h1>
                <h3># Investments Made</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>${investedActive?moneyFormatter(investedActive):0.00}</h1>
                <h3>USDC Currently Invested</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>{activeTrades?activeTrades.length:0}</h1>
                <h3># Active Trades</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>${totalCollateral?moneyFormatter(totalCollateral):0.00}</h1>
                <h3>Collateral</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$29.88</h1>
                <h3>Current PNL</h3>
            </div>

        </section>
    )
}

export default InvestmentStats
