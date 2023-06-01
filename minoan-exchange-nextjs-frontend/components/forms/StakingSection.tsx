'use client';
import React, {  useState } from 'react'
import StakingForm from './StakingForm'
import UnStakingForm from './UnStakingForm';
import { Address } from 'wagmi';
import { Switch } from '@mui/material';

interface Props {
    availableUsdc: number;
    poolToken: any;
    user: Address;
    name: string;
    poolBalance: {
        availableUsdc: number;
        totalUsdcSupply: number;
    };
}

const StakingSection: React.FC<Props> = ({ availableUsdc, poolToken, user, name, poolBalance }) => {
    const [mode, setMode] = useState<string>("staking");
    const handleSwitch = () => {
        if (mode === "staking") {
            setMode("unstaking");
        } else {
            setMode("staking");
        }
    }
    return (
        <div
            id={"staking"}
            className="col-span-9 lg:col-span-9 text-center "
        >
            <div className='flex flex-row justify-center'>
                <h1 className="my-4 text-white">{String(mode).toUpperCase()}</h1>
                <div className='ml-2 mt-1 bg-amber-400 border rounded-full'>
                    <Switch color="warning" aria-controls='blue' disabled={false} onChange={handleSwitch} />
                    </div>
            </div>
            {mode === "staking" ? (
                <>
                    <StakingForm availableUsdc={availableUsdc} poolToken={poolToken} user={user} name={name} totalUSDCSupply={poolBalance.totalUsdcSupply} />
                </>
            ) : (
                <>
                    <UnStakingForm poolAvailableUsdc={poolBalance.availableUsdc} poolToken={poolToken} user={user} name={name} totalUSDCSupply={poolBalance.totalUsdcSupply} />
                </>
            )}
        </div>
    )
}

export default StakingSection
