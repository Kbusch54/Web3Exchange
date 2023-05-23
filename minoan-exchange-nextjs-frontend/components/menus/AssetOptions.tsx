'use client'
import React from 'react'
import { Stock } from '../../types/custom'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

interface Props {
    stockData: Stock[]
    assetName: string
}

const AssetOptions: React.FC<Props> = ({stockData,assetName}) => {
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Button variant="contained" {...bindTrigger(popupState)} className="text-2xl">
              {assetName}
            </Button>
            <Menu {...bindMenu(popupState)}>
              {stockData.map((stock: Stock) => (
                <MenuItem className=' hover:bg-slate-900 hover:text-white' >
                  <a href={`/invest/${stock.symbol}`} onClick={popupState.close} >
                    <div className='w-12 flex flex-row justify-between mx-4'>
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

export default AssetOptions
