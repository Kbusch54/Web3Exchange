'use client'
import React, { useEffect, useState } from 'react'
import SingleTrade from './SingleTrade';
import { Address } from 'wagmi';
import { ethers } from 'ethers';
import SingleGlobalTrade from './SingleGlobalTrade';
import { getAmmId } from '../../../utils/helpers/doas';
import { useRouter } from 'next/navigation';

export const revalidate = 8000;
interface Props {
    user: Address;
    userAvailableBalance: number;
    active?: boolean;
    amm?: string;
    global?: boolean;
}
interface rows {
    row: {
        id: string;
        side: number;
        asset: string;
        size: number;
        lev: number;
        pnl: string;
        created: number;
        isActive: boolean;
        userAdd: Address;
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
            exitPrice: number;
        }
        other: {
            baseAssetReserve: number,
            quoteAssetReserve: number,
            loanAmt: number,
            maxLoanAmt: number,
            interestPeriodsPassed: number
            minLoanAmt: number,
            openLoan: number,
            openLeverage: number,
            tradingFee: number
        }
    }
}
const AllTrades: React.FC<Props> = ({ user, userAvailableBalance, active = true, amm, global = false }) => {
    const router = useRouter();
    const refetch = () => {
        router.refresh();
        fetch(`http://localhost:3000/api/tradeData`).then((res) => res.json()).then((data) => {
            setTradeData(data);
            setLoading(false);
        })
    }
    const getInterestPayment = (loanAmt: number, interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number) => {
        return Math.floor((now - lastInterestPayed) / interestPeriod) * (loanAmt * interestRate / 10 ** 6);
    }
    const getPnlActiveTrades = (baseAsset: number, quoteAsset: number, psize: number, loanAmt: number,  interestPayed: number, tradingFee: number) => {
        let quoteWPsz = Number(quoteAsset) + Number(psize);
        let k = Number(baseAsset) * Number(quoteAsset);
        let newBaseAsset = (Number(k)) / Number(quoteWPsz);
        return Math.floor(Math.abs(Number(baseAsset) - Number(newBaseAsset)) - Math.abs(Number(tradingFee) + Number(loanAmt) + Number(interestPayed)));
    }
    const encodedData = (addr1: Address, addr2: Address, num: Number, intNum: Number) => ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256', 'int256'], [addr1, addr2, num, intNum]);

    const tradesToRows = (trades: any) => {
        return trades.map((trade: any) => {
            const { tradeBalance, startingCost, isActive, liquidated, vamm, user, tradeOpenValues,ffrPayed } = trade;
            const { openValue, openLoanAmt, openCollateral, openLeverage, openEntryPrice, openPositionSize, openInterestRate, tradingFee } = tradeOpenValues;
            const { side, positionSize, leverage, pnl, interestRate, LastFFRPayed, collateral, LastInterestPayed, tradeId, loanAmt, entryPrice, exitPrice, exitTime } = tradeBalance;
            const { mmr, interestPeriod, maxLoan, minLoan } = vamm.loanPool;
            const { marketPrice, indexPrice } = vamm.priceData[0];
            const { ffr, baseAssetReserve, quoteAssetReserve } = vamm.snapshots[0];
            const now = isActive ? Math.floor(Date.now() / 1000) : exitTime;
            const interestPayment = getInterestPayment(isActive ? loanAmt : openLoanAmt, isActive ? interestRate : openInterestRate, now, isActive ? LastInterestPayed : trade.created, interestPeriod);
            const pnlCalc = getPnlActiveTrades(baseAssetReserve, quoteAssetReserve, positionSize, loanAmt, interestPayment, tradingFee);
            const vammAdd = vamm.id;
            const tradeID = encodedData(user.id, vammAdd, trade.created, side);
            const getDateTime = (timestamp: number) => {
                const date = new Date(timestamp * 1000);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hour = date.getHours();
                const min = date.getMinutes();
                const sec = date.getSeconds();
                return `${month}/${day} ${hour > 12 ? hour - 12 : hour}:${min < 10 ? '0'.concat(min.toString()) : min} ${hour > 12 ? 'PM' : 'AM'}`;
            }
            return {
                id: tradeID,
                side: side,
                asset: vamm.symbol,
                size: active ? positionSize : openPositionSize,
                lev: active ? leverage : openLeverage,
                pnl: pnlCalc,
                created: getDateTime(trade.created),
                isActive: isActive,
                liquidated: liquidated,
                vamm: vamm.id,
                userAdd: user.id,
                information: {
                    mmr: mmr,
                    ffr: ffr,
                    ffrPayed:ffrPayed,
                    LastFFRPayed: LastFFRPayed,
                    ffrReturn: 'ffrReturn',
                    liquidationPrice: 'liquidationPrice',
                    snapshots: vamm.snapshots,
                    interestRate: active ? interestRate : openInterestRate,
                    interestPeriod: interestPeriod,
                    interestAccrued: interestPayment,
                    startCollateral: openCollateral,
                    currentCollateral: collateral - interestPayment,
                    openValue: openEntryPrice * openPositionSize / 10 ** 8,
                    currentValue: Number(marketPrice) * Number(positionSize) / 10 ** 8,
                    entryPrice: entryPrice,
                    exitPrice: exitPrice,
                    exitTime: exitTime
                },
                other: {
                    baseAssetReserve: baseAssetReserve,
                    quoteAssetReserve: quoteAssetReserve,
                    loanAmt: loanAmt,
                    maxLoanAmt: maxLoan,
                    interestPeriodsPassed: Math.floor((now - LastInterestPayed) / interestPeriod),
                    minLoanAmt: minLoan,
                    openLoan: openLoanAmt,
                    openLeverage: openLeverage,
                    tradingFee: tradingFee

                }
            }
        })

    }
    const [tradeData, setTradeData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`http://localhost:3000/api/tradeData`).then((res) => res.json()).then((data) => {
            setTradeData(data);
            setLoading(false);
        })

    }, []);
    if (loading) return (
        <div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
            <div className='grid grid-cols-7 justify-evenly text-center animate-pulse'>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>TradeId</div>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>Assets</div>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>Side</div>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>Position Size</div>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>Leverage</div>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>Pnl</div>
                <div className='text-gray-800 text-lg lg:text-2xl m-2 bg-gray-700'>Active Since</div>
            </div>
            <div className='grid grid-cols-7 justify-evenly text-center border border-amber-400/40 rounded-lg animate-pulse '>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800 gap-x-3 flex flex-row'></div>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800'>hh</div>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800'>h</div>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800'>hh</div>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800'>hh</div>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800'>hh</div>
                <div className='text-gray-800 text-md  lg:text-xl m-2 bg-gray-800'>hh</div>
            </div>
        </div>
    );
    if (!tradeData) return (<div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
        <div className='grid grid-cols-7 justify-evenly text-center animate-pulse'>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>TradeId</div>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>Assets</div>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>Side</div>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>Position Size</div>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>Leverage</div>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>Pnl</div>
            <div className='text-white text-lg lg:text-2xl m-2 bg-white'>Active Since</div>
        </div>
        <div className='grid grid-cols-7 justify-evenly text-center border border-amber-400/40 rounded-lg animate-ping '>
            <div className='text-white text-md  lg:text-xl m-2 bg-white gap-x-3 flex flex-row'></div>
            <div className='text-white text-md  lg:text-xl m-2 bg-white'>hh</div>
            <div className='text-white text-md  lg:text-xl m-2 bg-white'>h</div>
            <div className='text-white text-md  lg:text-xl m-2 bg-white'>hh</div>
            <div className='text-white text-md  lg:text-xl m-2 bg-white'>hh</div>
            <div className='text-white text-md  lg:text-xl m-2 bg-white'>hh</div>
            <div className='text-white text-md  lg:text-xl m-2 bg-white'>hh</div>
        </div>
    </div>);

    const rows: rows = tradesToRows(tradeData);
    let inD = 0;
    const ammId = amm ? getAmmId(amm) : null;
    if (!global) {
        if (active) {

            
            return (
                <div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
                    <div className='grid grid-cols-7 justify-evenly text-center '>
                        <div className='text-white text-lg lg:text-2xl m-2'>TradeId</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Assets</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Side</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Position Size</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Leverage</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Pnl</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Active Since</div>
                    </div>

                    <hr className='border-white' />
                    {/* @ts-ignore */}
                    {rows.map((row, index) => {

                        if (active && row.isActive && !row.liquidated && String(row.userAdd).toLowerCase() === String(user).toLowerCase()) {
                            if (amm ? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()) : true) {
                                return <SingleTrade key={row.id} row={row} index={index} user={user} userAvailableBalance={userAvailableBalance} refetch={refetch} />;
                            } else {
                                return null;
                            }
                        } else if (!active && (!row.isActive || row.liquidated) && String(row.userAdd).toLowerCase() === String(user).toLowerCase()) {
                            if (amm ? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()) : true) {
                                return <SingleTrade key={row.id} row={row} index={index} user={user} userAvailableBalance={userAvailableBalance} refetch={refetch} />;
                            } else {
                                return null;
                            }
                        } else {
                            return null;
                        }
                    })}

                </div>
            )
        } else {
            return (
                <div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
                    <div className='grid grid-cols-7 justify-evenly text-center '>
                        <div className='text-white text-lg lg:text-2xl m-2'>TradeId</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Assets</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Side</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Open Position Size</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Open Leverage</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Pnl</div>
                        <div className='text-white text-lg lg:text-2xl m-2'>Created</div>
                    </div>
                    <hr className='border-white' />
                    {/* @ts-ignore */}
                    {rows.map((row, index) => {
                        if (!active && (!row.isActive || row.liquidated) && String(row.userAdd).toLowerCase() === String(user).toLowerCase()) {
                            if (amm ? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()) : true) {
                                return <SingleTrade key={row.id} row={row} index={index} user={user} userAvailableBalance={userAvailableBalance} refetch={refetch} />;
                            } else {
                                return null;
                            }
                        }
                    })}

                </div>
            )
        }
    } else {
        return (
            <div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
                <div className='grid grid-cols-7 justify-evenly text-center '>
                    <div className='text-white text-lg lg:text-2xl m-2'>TradeId</div>
                    <div className='text-white text-lg lg:text-2xl m-2'>Assets</div>
                    <div className='text-white text-lg lg:text-2xl m-2'>Side</div>
                    <div className='text-white text-lg lg:text-2xl m-2'>Position Size</div>
                    <div className='text-white text-lg lg:text-2xl m-2'>Leverage</div>
                    <div className='text-white text-lg lg:text-2xl m-2'>Pnl</div>
                    <div className='text-white text-lg lg:text-2xl m-2'>Active Since</div>
                </div>
                <hr className='border-white' />
                {/* @ts-ignore */}
                {rows.map((row, index) => {
                    if (active && row.isActive && !row.liquidated && String(row.userAdd).toLowerCase() != String(user).toLowerCase()) {
                        if (amm ? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()) : true) {
                            return <SingleGlobalTrade key={row.id} row={row} index={index} />;
                        } else {
                            return null;
                        }
                    } else if (!active && (!row.isActive || row.liquidated) && String(row.userAdd).toLowerCase() != String(user).toLowerCase()) {
                        if (amm ? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()) : true) {
                            return <SingleGlobalTrade key={row.id} row={row} index={index} />;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                })}

            </div>
        )
    }

}

export default AllTrades
