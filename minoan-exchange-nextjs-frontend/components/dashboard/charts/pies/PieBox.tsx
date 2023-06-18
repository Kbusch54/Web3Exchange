'use client'
import React, { useEffect, useState, use } from 'react'
import RechartPie from '../../../charts/poolCharts/recharts/RechartPie'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Transition } from '@headlessui/react';
import { Address } from 'wagmi';
import { getAmmName } from 'utils/helpers/doas';

interface Props {
    userData: any,
    user: Address
}

const PieBox: React.FC<Props> = ({ userData ,user}) => {
    const [selected, setSelected] = useState(false)
    const [graphType, setGraphType] = useState(0)

    // getting user trades
    const investmentData: { name: string; value: number; }[] = [];
    const stakingData: { name: string; value: number; }[] = [];

    const ammInvestMap = new Map();
    const ammStakeMap = new Map();
    for(let i = 0; i < userData?.trades?.length; i++){
           let amm = getAmmName(userData.trades[i].ammPool.id.toLowerCase());
           ammInvestMap.set(amm, (ammInvestMap.get(amm) ?? 0) + 1)
    }
    for(let i = 0; i < userData?.users[0]?.stakes?.length; i++){
              let amm;
              let amount = userData.users[0].stakes[i].totalStaked /10**6;
              if(userData.users[0].stakes[i].ammPool != null){
                  amm = getAmmName(userData.users[0].stakes[i].ammPool.id.toLowerCase());
                  console.log('this is amm pool id', userData.users[0].stakes[i].ammPool.id);
                  console.log('this is amm', amm);
                  ammStakeMap.set(amm, (ammStakeMap.get(amm) ?? 0) + amount)
                }else{
                    amm = 'Theseus';
                    ammStakeMap.set(amm, (ammStakeMap.get(amm) ?? 0) + amount)
                }
    }
    ammInvestMap.forEach(function(value, key) {
        investmentData.push({name: key, value: value})
    })
    ammStakeMap.forEach(function(value, key) {
        stakingData.push({name: key, value: value})
    })
    console.log('this is staking data', stakingData);
    useEffect(() => {
        setSelected(prev => false)
    }, [graphType])
    return (
        <div className='col-span-12 mx-0 md:mx-12 lg:col-span-6 2xl:col-span-4 3xl-col-span-3 px-8'>
            <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300 relative'>
                <div className='flex flex-row justify-between mx-6 lg:mx-0 3xl:mx-4'>

                    <p className='text-white text-3xl pt-4'>{graphType == 0 ? 'Investments' : "Staking"}</p>
                    <button className={`text-3xl text-white ${selected ? 'hidden' : 'block'}`} onClick={() => setSelected(prev => !prev)} >
                        <KeyboardArrowDownIcon height={50} />
                    </button>
                    <button className={`text-3xl text-white ${!selected ? 'hidden' : 'block'}`} onClick={() => setSelected(prev => !prev)}>
                        <KeyboardArrowUpIcon height={50} />
                    </button>
                </div>
                <Transition
                    show={selected}
                    enter="transition ease-in-out duration-5000 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-10000 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className={`absolute right-0 w-full  grid bg-slate-800 border-2 border-slate-700  grid-cols-2   `} >
                        <button onClick={() => setGraphType(1)} className={` col-span-1 text-xl text-center ${graphType == 0 ? 'text-white hover:text-slate-800 hover:bg-white  hover:scale-110' : 'text-slate-800 bg-white border-4 border-slate-900 scale-90'}`}>Staking</button>
                        <button onClick={() => setGraphType(0)} className={` col-span-1 text-xl text-center ${graphType == 1 ? 'text-white hover:text-slate-800 hover:bg-white  hover:scale-110' : 'text-slate-800 bg-white border-4 border-slate-900 scale-90'}`}>Investments</button>
                    </div>
                </Transition>
            </div>
            <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
            {graphType == 0 ? (
                <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none'>
                    <RechartPie  dataForPie={investmentData} toolTipLabel={'trades '}/>
                </div>
            ) : (
                <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none'>
                    <RechartPie dataForPie={stakingData} toolTipLabel={'$'} />
                </div>
            )}
        </div>
    )
}

export default PieBox;
