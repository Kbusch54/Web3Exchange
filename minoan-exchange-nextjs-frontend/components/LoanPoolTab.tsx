'use client';
import {useState} from 'react';
import * as React from 'react';

import LoanStepper from './LoanStepper';


export default function LoanPoolTab() {

 const [idPicked,setIdPicked] = useState(0);

//  @ts-ignore
  const handleChange = (e) => {
    e.preventDefault();
    setIdPicked(prev=>Number(e.target.id));
  };

  return (
    <div  className={`min-w-[400px]  rounded-2xl mx-auto my-2 flex  flex-col align-middle justify-between shadow-xl`}>
      <div className='flex justify-between w-full' >
        <button onClick={(e)=>handleChange(e)} id='0' className={`text-white font-bold bg-transparent w-full m-2 border-0 flex justify-center hover:bg-blue-400 hover:scale-125  focus:outline-blue-500`}>Loan Pool</button>
        <button onClick={(e)=>handleChange(e)} id='1' className={`text-white font-bold bg-transparent w-full m-2 border-0 flex justify-center hover:bg-blue-400 hover:scale-125  focus:outline-blue-500`}>Rewards and Risk</button>
        <button onClick={(e)=>handleChange(e)} id='2' className={`text-white font-bold bg-transparent w-full m-2 border-0 flex justify-center hover:bg-blue-400 hover:scale-125  focus:outline-blue-500`}>How To become liquidity provider</button>
      </div>
      <div  className={`w-full m-3 ${idPicked==0?'block':'hidden'}`}>
        <div className='flex flex-col text-left gap-y-2 text-lg'>
            <p>Our loan pools are called Ariadne pools. In the myth of Theseus, Ariadne daughter of King Minas, gifts Thesues the yarn to help him traverse the Labrynth. Without her help Theseus would have surley parashed like many before. Just as a liquidity provider gives traders a chance at success.</p>
            <p>Each trading pair has its own individual loan pool. As well as a corresponding DAO, to control the aspects of the loans. I.E. max leverage allowed, max loan, the minimum margin requirments, the interest rate and interest periods.</p>
            <p>In order to become a liquity provider and be apart of the DAO one must stake USDC for the particular loan pool.</p>
            <p>Once a liquidity provider has staked their USDC they will be able to vote on the various aspects of the loan pool. As well as claim rewards for being a liquidity provider.</p>
            <p>When one stakes USDC they will recieve the LP&apos;s ERC1155 token which can be transfered bought or sold outside of the protocol. This token can be used to vote on the respective DAO.</p>
            <p>At anytime a staker may transfer their tokens back to the pool to recieve their portion via percentage of USDC in the pool.</p>
            <p>If at any point the pool&apos;s availble funds, i.e. USDC is loaned out, the staker may not be able to redeem full amount of USDC at that time, in order to protect the underlying pool.</p>
        </div>
      </div>
      <div className={`w-full m-3 ${idPicked==1?'block':'hidden'}`}>     
        <div className='flex flex-col text-left gap-y-2 text-lg'>
            <p>Rewards for being a liquidity provider will vary from pool to pool according to their respective DAO&apos;s. As well as the the reward periods. One can expect a certain percentage of trading and interest payments to go to rewards while the remaining go directly into the pool.</p>
            <p>If a stakers respective rewards are not claimed within the alloted time period set by the DAO their reward and any other staker&apos;s rewards will be deposited into the pool. One may check rewards via the Ariadne pools page.</p>
            <p>How this protocol functions is if an investor&apos;s pnl is positive upon close after their interest payment and funding rate are adjusted, first their collateral is drained to pay their pnl and any further payments required will come form the corresponding loan pool.</p>
            <p>If the loan pool drops below a certain margin, dictaded by the protocol DAO i.e. The Theseus DAO, debt will be issued to the loan pool to pay the investor from the protocol insurance fund. Upon debt insuance to a loan pool a portion of rewards and other fees will go into the insurance fund until the LP&apos;s debt is payed. </p>
            <p>Important note although each LP has significat control over how loans are structured, the Theseus DAO does have control over the range of allowed controllabloe variables for the pools.</p>
        </div>
      </div>
      <div className={`w-full m-3 px-28 ${idPicked==2?'block':'hidden'}`}>
        <div className='min-w-[40vw]'>

            <LoanStepper/>
        </div>
      </div>
    </div>
  );
}