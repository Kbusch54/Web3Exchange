'use client';
import React, { useState, useEffect } from 'react'
import { Address } from 'wagmi';
import VotingProportion from './utils/VotingProportion';
import ExecuteProposalButton from '../forms/buttons/ExecuteProposalButton';

interface Props {
    index: number;
    isHolder:boolean;
    proposal: {
        nonce: number;
        isPassed: boolean;
        to: Address;
        proposer: Address;
        transactionHash: string;
        proposedAt: string;
        dAO: {
            id: Address,
            votesNeededPercentage: number,
            tokenId: number
            maxVotingPower:number,
            minVotingPower:number,
            votingTime: number;
            poolToken: {
                tokenBalance: [
                    {user: {
                        id: Address;
                    }
            }]
            }
          }
    }
  
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

    }
    user:Address;
}

const SingleProposal: React.FC<Props> = ({ proposal, dbData,index,user,isHolder }) => {
    const [toggle, setToggle] = useState<boolean>(true)
    const [votesReceived, setVotesReceived] = useState<number>(0)

        
    const handleToggle = () => {
        console.log('toggle');
        setToggle(!toggle)
    }
    useEffect(() => {
        index==0&&handleToggle()
    }, [])
    useEffect(() => {
        console.log('votes received',votesReceived);
    }, [votesReceived])


    return (
        <div className=''>
            <div className='grid grid-cols-6 justify-evenly text-center border border-amber-400/40 rounded-lg' key={proposal.nonce}>
                <div className='text-white text-md  lg:text-xl m-2 gap-x-3 relative'>
                    <button onClick={handleToggle} className='absolute left-2'>{'->'}</button>
                    <div className=''>{proposal.nonce}</div>
                </div>
                <div className='text-white text-md  lg:text-xl m-2'>{dbData ? (
                    <p>yes</p>) : (<p>no</p>)}
                </div>
                <div className='text-white text-md  lg:text-xl m-2'>{dbData ? (
                    <p>yes</p>) : (<p>no</p>)}
                </div>
                <div className='text-white text-md  lg:text-xl m-2'> {dbData?.signers ?(
                            <VotingProportion signers={dbData.signers} maxVotingPower={proposal.dAO.maxVotingPower} minVotingPower={proposal.dAO.minVotingPower} tokenId={proposal.dAO.tokenId} func={setVotesReceived} />
                        ):(<p>0%</p>)}</div>
                <div className='text-white text-md  lg:text-xl m-2'>{proposal.dAO.votesNeededPercentage/10**2}%</div>
                <div className='flex flex-row justify-center'>
                    {votesReceived >=(proposal.dAO.votesNeededPercentage)/10**2 && dbData.signers && (
                        <ExecuteProposalButton user={user} addressTo={proposal.to} nonce={proposal.nonce}ariadneAdd={proposal.dAO.id}callData={proposal.transactionHash} signatures={dbData.signers} disabled={false} />
                    )}
                    {dbData?.signers?.includes(user) && votesReceived <(proposal.dAO.votesNeededPercentage)/10**2 && (
                        <button className='text-white text-md  lg:text-xl m-2 bg-amber-400 rounded-3xl px-2 py-1'>Check</button>
                    )}
                     {!dbData?.signers?.includes(user) && isHolder && votesReceived <(proposal.dAO.votesNeededPercentage)/10**2 && (
                        <button className='text-white text-md  lg:text-xl m-2 bg-amber-400 rounded-3xl px-2 py-1'>Vote</button>
                    )}
                    {!isHolder && votesReceived <(proposal.dAO.votesNeededPercentage)/10**2 &&(
                        <button className='text-white text-md  lg:text-xl m-2 bg-amber-400 rounded-3xl px-2 py-1'>Stake</button>
                    )}
                    <p className='text-xs'>dot</p>
                </div>
            </div>
                <div className={`bg-slate-800 ${toggle?'hidden':'block'}`}>
                    <div className='text-white text-xl m-2 text-left'>Information</div>
                    <div className='grid grid-cols-2  lg:grid-cols-3 justify-evenly text-center border border-amber-400/40 rounded-lg gap-y-4 bg-slate-700'>
                        <div className='text-white text-lg flex flex-row border justify-evenly text-center border-white/10'>
                            <p>Proposer:</p>
                            <p>{proposal.proposer.slice(0, 10)}</p>
                        </div>
                        <div className='text-white text-lg flex flex-row border justify-evenly text-center border-white/10'>
                            <p>To:</p>
                            <p>{proposal.to.slice(0, 10)}</p>
                        </div>
                        <div className='text-white text-lg flex flex-row border justify-evenly text-center border-white/10'>
                            <p># of Signers:</p>
                            <p>{dbData ? dbData.signers?.length : 0}</p>
                        </div>
                        <div className='text-white text-lg flex flex-row border justify-evenly text-center border-white/10'>
                            <p>Created:</p>
                            <p>{proposal.proposedAt}</p>
                        </div>
                        <div className='text-white text-sm lg:text-lg flex flex-row border justify-evenly text-center border-white/10 col-span-2'>
                            <p className='text-sm lg:text-lg'>TransactionHash:</p>
                            <p className='text-sm lg:text-lg'>{proposal.transactionHash.slice(0, 15)}{'...[copy]'}</p>
                        </div>
                        {dbData && (
                            <div className='text-white text-md lg:text-lg flex flex-row border gap-x-4 text-left m-1 border-white/10 col-span-2 lg:col-span-3'>
                                <p className='ml-6'>Description:</p>
                                <p className='overflow-auto'>{dbData.description}</p>
                            </div>)}

                    </div>
                </div>
        </div>
    )
}

export default SingleProposal
