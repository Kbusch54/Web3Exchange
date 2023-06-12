'use client';
import React, { useEffect, useState } from 'react'
import SideSelection from '../utils/SideSelection';
import AddCollateralModal from '../../modals/trade/AddCollateralModal';
import { Address } from 'wagmi';
import RemoveCollateralModal from '../../modals/trade/RemoveCollateralModal';
import AddLiquidityModal from '../../modals/trade/AddLiquidityModal';
import RemoveLiquidityModal from '../../modals/trade/RemoveLiquidityModal';
import ClosePositionModal from '../../modals/trade/ClosePositionModal';
import { formatEther, formatUnits } from 'ethers/lib/utils.js';
import { moneyFormatter } from '../../../utils/helpers/functions';
import { Transition } from '@headlessui/react';
import TradeInformation from './TradeInformation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Props {
    user: Address;
    userAvailableBalance: number
    index: number;
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

const SingleTrade: React.FC<Props> = ({ row, index, userAvailableBalance, user }) => {
    const [toggle, setToggle] = useState<boolean>(true)
    const handleToggle = () => {
        setToggle(!toggle)
    }
    useEffect(() => {
        index == 0 && handleToggle()
    }, [])


    const margin = row.information.currentCollateral / (row.lev * row.information.startCollateral) * 100
    return (
        <div key={row.id} className=' '>
            <div className='grid grid-cols-7 justify-evenly text-center border border-amber-400/40 rounded-lg '>
                <div className='text-white text-md  lg:text-xl m-2 gap-x-3 flex flex-row'>
                    {/* @ts-ignore */}
                    <button onClick={(e) => handleToggle(e)}>{toggle ? (<KeyboardArrowDownIcon />) : (<KeyboardArrowUpIcon />)}</button>
                    <div>{row.id.slice(32, 42)}</div>
                </div>
                <div className='text-white text-md  lg:text-xl m-2'>{row.asset}</div>
                <div className='text-white text-md  lg:text-xl m-2'><SideSelection side={row.side} /></div>
                <div className='text-white text-md  lg:text-xl m-2'>{(row.size / 10 ** 8).toFixed(4)}</div>
                <div className='text-white text-md  lg:text-xl m-2'>{row.lev}</div>
                <div className='text-white text-md  lg:text-xl m-2'>{Number(row.pnl) > 0 ? `$${moneyFormatter(Number(row.pnl))}` : ` - $${Number(moneyFormatter(Number(row.pnl) * -1))}`}</div>
                <div className='text-white text-md  lg:text-xl m-2'>{row.created}</div>
            </div>
            <div >
                <Transition
                    show={!toggle}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <TradeInformation row={row} user={user} userAvailableBalance={userAvailableBalance}/>
                </Transition>
            </div>
        </div>
    )
}

export default SingleTrade
