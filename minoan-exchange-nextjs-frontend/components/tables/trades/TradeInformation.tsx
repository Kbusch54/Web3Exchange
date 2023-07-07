import { formatUnits } from 'ethers/lib/utils.js'
import React,{useState} from 'react'
import { Address } from 'wagmi'
import AddCollateralModal from '../../modals/trade/AddCollateralModal'
import AddLiquidityModal from '../../modals/trade/AddLiquidityModal'
import ClosePositionModal from '../../modals/trade/ClosePositionModal'
import RemoveCollateralModal from '../../modals/trade/RemoveCollateralModal'
import RemoveLiquidityModal from '../../modals/trade/RemoveLiquidityModal'
import { moneyFormatter } from 'utils/helpers/functions'

interface Props {
    refetch: () => void;
    user: Address;
    userAvailableBalance: number
    row: {
        id: string;
        side: number;
        asset: string;
        size: number;
        lev: number;
        pnl: string;
        created: number;
        information: {
            mmr: number;
            ffr: number;
            ffrReturn: string;
            liquidationPrice: number;
            interestRate: number;
            interestPeriod: number;
            interestAccrued: number;
            startCollateral: number;
            currentCollateral: number;
            openValue: number;
            currentValue: number;
            entryPrice: number;
        }
        other: {
            baseAssetReserve: number,
            quoteAssetReserve: number,
            loanAmt: number,
            maxLoanAmt: number,
            interestPeriodsPassed: number
            minLoanAmt: number,
        }
    }
}

const TradeInformation: React.FC<Props> = ({user,userAvailableBalance,row,refetch}) => {
    const margin=row.information.currentCollateral/row.other.loanAmt
    
    return (
        <div className={`bg-slate-800 `}>

                        <div className='text-white text-xl m-2'>Information</div>
                        <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-11  xl:grid-cols-11 justify-evenly text-center border border-amber-400/40 rounded-lg '>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Entry Price</p>
                                <p>${moneyFormatter(row.information.entryPrice)}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Current Margin</p>
                                <p>{(margin*100).toFixed(2)}%</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>FFR</p>
                                <p>{Number(row.information.ffr) / 10 ** 4}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Liquidation Price</p>
                                <p>$123.44</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Start Collateral</p>
                                <p>${formatUnits(row.information.startCollateral, 6)}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Current Collateral</p>
                                <p>${formatUnits(row.information.currentCollateral, 6)}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Interest Rate</p>
                                <p>{Number(row.information.interestRate) / 10 ** 4}%</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Interest Periods</p>
                                <p>{row.other.interestPeriodsPassed}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Interest Accurred</p>
                                <p>${moneyFormatter(row.information.interestAccrued)}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Open Value</p>
                                <p>${moneyFormatter(row.information.openValue)}</p>
                            </div>
                            <div className='text-white text-lg flex flex-col border border-white/10'>
                                <p>Current Value</p>
                                <p>${moneyFormatter(row.information.currentValue)}</p>
                            </div>
                        </div>
                        <div className='flex flex-row justify-evenly text-center text-white mt-4 pb-4 text-sm md:text-md lg:text-xl'>
                            <AddCollateralModal refetch={refetch} user={user} tradeId={row.id} vaultBalance={userAvailableBalance} currentCollateral={row.information.currentCollateral}  />
                            <RemoveCollateralModal refetch={refetch} currentInterestPayment={row.other.loanAmt*Number(row.information.interestRate) / 10 ** 6} user={user} tradeId={row.id} minimummarginReq={Math.floor(row.information.mmr * row.other.loanAmt / 10 ** 6)} currentCollateral={row.information.currentCollateral} />
                            <AddLiquidityModal refetch={refetch}  user={user} tradeId={row.id} vaultBalance={userAvailableBalance} leverage={row.lev} minLoanAmt={row.other.minLoanAmt}
                                positionSize={row.size} vammData={{ baseAsset: row.other.baseAssetReserve, quoteAsset: row.other.quoteAssetReserve }} minimummarginReq={row.information.mmr}
                                currentCollateral={row.information.currentCollateral} currrentLoanAmt={row.other.loanAmt} maxLoanAmt={row.other.maxLoanAmt} side={row.side} />
                            <RemoveLiquidityModal refetch={refetch} user={user} tradeId={row.id} vaultBalance={userAvailableBalance} leverage={row.lev}
                                currentPositionSize={row.size} vammData={{ baseAsset: row.other.baseAssetReserve, quoteAsset: row.other.quoteAssetReserve }} minimummarginReq={row.information.mmr}
                                currentCollateral={row.information.currentCollateral} currrentLoanAmt={row.other.loanAmt} maxLoanAmt={row.other.maxLoanAmt} side={row.side} />
                            <ClosePositionModal refetch={refetch} user={user} tradeId={row.id} vaultBalance={userAvailableBalance} leverage={row.lev}
                                currentPositionSize={row.size} vammData={{ baseAsset: row.other.baseAssetReserve, quoteAsset: row.other.quoteAssetReserve }} minimummarginReq={row.information.mmr}
                                currentCollateral={row.information.currentCollateral} currrentLoanAmt={row.other.loanAmt} maxLoanAmt={row.other.maxLoanAmt} side={row.side} />
                        </div>
                    </div>
    )
}

export default TradeInformation
