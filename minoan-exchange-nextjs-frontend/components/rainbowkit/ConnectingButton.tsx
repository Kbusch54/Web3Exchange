"use client";
import React from 'react'

import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props {

}

const ConnectingButton: React.FC<Props> = () => {
    return (
        <div className='mt-4'>

            <ConnectButton showBalance={true} accountStatus={'address'} />
        </div>
    )
}

export default ConnectingButton
