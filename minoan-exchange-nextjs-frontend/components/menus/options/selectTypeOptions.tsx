'use client'
import React from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import  { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';

interface Props {
    changeType: (type: string) => void
    typeSelectedParent: string
}

const SelectType: React.FC<Props> = ({changeType,typeSelectedParent}) => {
  const types = ['pool', 'trading', 'proposal'];
  const popupState = usePopupState({ variant: 'popover', popupId: 'typeSelect' });
  const handleClose = () => {
    popupState.close();
  };

  const handleChoiceAndClose = (typeSelect: string) => {
    changeType(typeSelect);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="contained" {...bindTrigger(popupState)} className="text-2xl">
        {typeSelectedParent}
      </Button>
      <Menu {...bindMenu(popupState)}>
        {types.map((typeSelect: string) => (
          <MenuItem key={typeSelect} className=' hover:bg-slate-900 hover:text-white' >
            <div onClick={() => handleChoiceAndClose(typeSelect)}>
              <div className='w-18 flex flex-row justify-center text-center mx-4'>
                  <p className='text-center'>{typeSelect.toUpperCase()}</p>
              </div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

export default SelectType
