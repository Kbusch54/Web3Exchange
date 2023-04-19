'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Stock } from '../../types/custom';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    stockData: Stock[]
}

const StockOptionMenu: React.FC<Props> = ({stockData}) => {

    console.log(stockData);
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button variant="contained" {...bindTrigger(popupState)}>
                        Assets
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        {stockData.map((stock: Stock) => (
                            <MenuItem >
                             <a href={`/invest/${stock.symbol}`} onClick={popupState.close} >
                                <div className='w-72 flex flex-row justify-between mx-4'>
                                    <div>
                                        <Image src={stock.img} alt={"stock-img"} height={50} width={50} />
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
