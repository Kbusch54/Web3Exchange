'use client'
import React, { useState } from 'react'
import DAOPurposals from './DAOPurposals';
import { Address } from 'wagmi';
import SingleProposal from './SingleProposal';

interface Props {
    user: Address,
    daoAddress: Address,
    tokenId: number
    proposals: Proposal[]
    hasStakes: boolean
    dbData: {
        nonce: number | null;
        signatures: string[] | null;
        description: string | null;
        etherscanTransactionHash: string | null;
        timeStamp: number | null;
        proposer: Address | null;
        contractAddress: Address | null;
        contractNonce: string | null;
        transactionHashToSign: string | null;
        executor: Address | null;
        isProposalPassed: boolean | null;
        result: string | null;
        signers: Address[] | null;
    }[]


}
interface Proposal {
        nonce: number;
        isPassed: boolean;
        to: Address;
        proposer: Address;
        transactionHash: string;
        proposedAt: number;
        data: string;
        theseusDAO:{
            id:Address,
            votingTime:number,
            votesNeededPercentage:number,
            tokenId:number,
            maxVotingPower:number,
            minVotingPower:number,
                    
          }
        dAO: {
            id: Address,
            votesNeededPercentage: number,
            tokenId: number
            maxVotingPower: number,
            minVotingPower: number,
            votingTime: number;
            poolToken: {
                tokenBalance: [
                    {
                        user: {
                            id: Address;
                        }
                    }]
            }
    }
}

const ProposalType: React.FC<Props> = ({ user, tokenId, daoAddress,proposals,hasStakes,dbData }) => {
    const [selected, setSelected] = useState(0);
    //@ts-ignore
    const handleSelected = (e) => {
        e.preventDefault();
        setSelected(e.target.innerText == 'Current' ? 0 : e.target.innerText == 'Passed' ? 1 : 2);
    }
    const nonceMap = new Map();
    //@ts-ignore
    dbData.forEach((prop) => {
        nonceMap.set(prop.nonce, prop);
    });
    return (
        <div>
            <h1 className='text-white text-center mb-4'>Proposals</h1>

            <div className='flex flex-row justify-evenly text-white text-xl bg-slate-900 border border-amber-400 rounded-t-full rounded-b-xl'>
                <button onClick={(e) => handleSelected(e)} className={`border border-gray-800 ${selected == 0 ? 'bg-slate-500 scale-125' : ' bg-slate-700'}`}>Current</button>
                <button onClick={(e) => handleSelected(e)} className={`border border-gray-800 ${selected == 1 ? 'bg-slate-500 scale-125' : ' bg-slate-700'}`}>Passed</button>
                <button onClick={(e) => handleSelected(e)} className={`border border-gray-800 ${selected == 2 ? 'bg-slate-500 scale-125' : ' bg-slate-700'}`}>Failed</button>
            </div>
            <div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
                <div className='grid grid-cols-6 justify-evenly text-center '>
                    <div className='text-white text-md lg:text-xl m-2'>Nonce</div>
                    <div className='text-white text-md lg:text-xl m-2'>Etherscan</div>
                    <div className='text-white text-md lg:text-xl m-2'>Expiration</div>
                    <div className='text-white text-md lg:text-xl m-2'>Votes %</div>
                    <div className='text-white text-md lg:text-xl m-2'>Vote Threshhold</div>
                    <div className='text-white text-md lg:text-xl m-2'></div>
                </div>
                <hr className='border-white' />
            </div>
            {proposals.map((proposal: Proposal,index: number) => {
                    if (nonceMap.get(Number(proposal.nonce))) {
                    }
                    let nonceMapData = nonceMap.get(Number(proposal.nonce));

                    return (
                        <SingleProposal type={selected} tokenId={tokenId} user={user} key={proposal.nonce} proposal={proposal} dbData={nonceMapData} index={index} isHolder={hasStakes}/>
                    )
                })}
        </div>
    )
}

export default ProposalType
