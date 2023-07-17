'use client'
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Stock } from '../../types/custom';
import Image from 'next/image';

interface Props {
    stockData: Stock[]
}

const StockOptionMenu: React.FC<Props> = ({stockData}) => {

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <button {...bindTrigger(popupState)} className="text-3xl bg-slate-800/80 border border-slate-800/30 text-white  rounded-xl hover:bg-blue-700 ">
                        Assets
                    </button>
                    <Menu {...bindMenu(popupState)}>
                        {stockData.map((stock: Stock) => (
                            <MenuItem key={String(stock.slug)} className=' hover:bg-slate-900 hover:text-white' >
                             <a href={`/invest/${stock.symbol}`} onClick={popupState.close} >
                                <div className='w-72 flex flex-row justify-between mx-4'>
                                    <div>
                                        <Image src={stock.img} alt={"stock-img"} height={70} width={70} />
                                    </div>
                                    <div className='self-center'>
                                        {stock.symbol}
                                    </div>
                                </div>
                            </a>
                            </MenuItem>
                        ))}
                     
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    )
}

export default StockOptionMenu
