'use client'
import React, { use } from 'react'
import { Address, useBalance } from 'wagmi'
import Image from "next/image";
import logo from "../../public/assets/minotaur-logo-thing.png";
import { usdc } from 'utils/address';
import { moneyFormatter } from 'utils/helpers/functions';
import { fetchWallet } from 'app/lib/graph/walletData';

interface Props {
    user: Address

}
type WalletData = {
    users: {
        balances: {
            availableUsdc: number|null
            totalCollateralUsdc: number|null
        }
    }[]
}

const Wallet: React.FC<Props> = ({ user }) => {
    const { data, error } = useBalance({
        address: user,
        token: usdc,
        watch: true,
    });
    const walletData:WalletData = use(fetchWallet(user));
    return (
        <div className='mt-0 2xl:mt-8 3xl:mt-0'>
            <div className='bg-transparent flex flex-row mx-[1.53rem]'>
                <p className=' w-1/2 rounded-t-2xl bg-slate-900 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600'>Wallet</p>
                <div className='w-[49.3%]  bg-[rgba(24,24,35,255)] border-b border-gray-600 '></div>
            </div>
            <div className='mx-6 mb-6 bg-slate-900 border-2 border-gray-600 border-t-0 text-white flex flex-col justify-center text-center gap-y-6 py-12 rounded-2xl rounded-tl-none'>

                <div className='border border-amber-400 p-2 mx-2 rounded-full bg-slate-900'>
                    <h3 className='text-amber-400 text-xs lg:text-xl'>{user}</h3>
                </div>
                <div className='grid grid-cols-4 mx-4'>
                    <div className='col-span-3 flex flex-row justify-around'>

                        <div className='flex flex-col '>
                            <div className='border-2 border-amber-400 rounded-3xl'>
                                {data ? (
                                    <p className=' text-lg'>
                                        ${moneyFormatter(Number(data?.value))}
                                    </p>
                                ):error?(
                                    <p className=' text-lg'>
                                       ' $0.00'
                                    </p>
                                ):(
                                    <p className=' text-lg'>
                                        Loading...
                                    </p>

                                )}
                            </div>
                            <p className='text-sm text-gray-600'>USDC Wallet Balance</p>
                        </div>
                        <div className='flex flex-col '>
                            <div className='border-2 border-amber-400 rounded-3xl'>
                                <p className=' text-lg'>${walletData.users[0].balances.totalCollateralUsdc?moneyFormatter(walletData.users[0].balances.totalCollateralUsdc):'0.00'}</p>
                            </div>
                            <p className='text-sm text-gray-600'>Current Collateral</p>
                        </div>
                    </div>
                    <div className='col-span-1'>
                        <div className='flex flex-col '>
                            <p className='text-xl '>6/12/23</p>
                            <p className='text-sm text-gray-600'>Joined</p>
                        </div>
                    </div>
                    <div className='col-span-8 flex flex-row relative'>
                        <div className='flex flex-col mt-4'>
                            <p className='text-lg'>Vault Balance</p>
                            <div className='p-2'>
                                <p className='text-3xl text-amber-400'>${walletData.users[0].balances.availableUsdc?moneyFormatter(walletData.users[0].balances.availableUsdc):'0.00'}</p>
                            </div>
                        </div>
                        <div className='absolute right-8 top-8'>
                            <Image src={logo} alt="logo" height={80} width={80} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet
