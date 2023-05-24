'use client'
import React from 'react'
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface Props {
    sideSelection:Function
}

const SideSelection: React.FC<Props> = ({sideSelection}) => {
    const [side, setSide] = React.useState<string>('short');

    const handleSideSelection = (
      event: React.MouseEvent<HTMLElement>,
      newSide: string,
    ) => {
      setSide(newSide);
      sideSelection(newSide)
    };
    return (
        <ToggleButtonGroup
      value={side}
      exclusive
      onChange={handleSideSelection}
      aria-label="text alignment"
    >
      <ToggleButton value="short" aria-label="left aligned" >
        <TrendingDownIcon color='error' className={`${side == 'short'&& 'scale-150 bg-slate-900'}`} />
      </ToggleButton>
      <ToggleButton value="long" aria-label="centered" >
        <TrendingUpIcon color='success' className={`${side == 'long'&& 'scale-150 bg-slate-900'}`} />
      </ToggleButton>
    
    </ToggleButtonGroup>
  );
    
}

export default SideSelection
