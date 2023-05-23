'use client';
import React from 'react'
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface Props {
    side: number
}

const SideSelection: React.FC<Props> = ({side}) => {
    return (
        <>
          {side == -1 ? <TrendingDownIcon color='error'  /> : <TrendingUpIcon color='success'  />}  
        </>
    )
}

export default SideSelection
