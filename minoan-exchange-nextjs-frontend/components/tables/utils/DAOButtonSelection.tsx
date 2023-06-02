import React from 'react'
import ExecuteProposalButton from '../../forms/buttons/proposals/ExecuteProposalButton'
import SignProposalButton from '../../forms/buttons/proposals/SignProposalButton'
import { Address } from 'wagmi';

interface Props {
    votesReceived: number;
    proposal: {
        nonce: number;
        to: Address;
        transactionHash: string;
        proposedAt: number;
        data: string;
        dAO: {
            id: Address,
            votesNeededPercentage: number,
        }
    }
    dbData: {
        signatures: string[] | null;
        signers: Address[] | null;
        transactionHashToSign: string | null;
    }
    user:Address;
    isHolder:boolean;
    id:Address;
    votesNeededPercentage:number;
}

const DAOButtonSelection: React.FC<Props> = ({proposal,user,dbData,votesReceived,isHolder,id,votesNeededPercentage}) => {
    return (
        <div className='flex flex-row justify-center'>
        {votesReceived >= (votesNeededPercentage) / 10 ** 2 && dbData.signatures && dbData.transactionHashToSign  && (
            <ExecuteProposalButton user={user} addressTo={proposal.to} nonce={proposal.nonce} ariadneAdd={id} callData={proposal.data} signatures={dbData.signatures} disabled={false} />
        )}
        {dbData?.signers?.includes(user) && votesReceived < (votesNeededPercentage) / 10 ** 2 && (
            <button className='text-white text-md  lg:text-xl m-2 bg-amber-400 rounded-3xl px-2 py-1'>Check</button>
        )}
        {!dbData?.signers?.includes(user) && isHolder && votesReceived < (votesNeededPercentage) / 10 ** 2 && (
            <SignProposalButton addressTo={proposal.to} contractAdd={id} nonce={proposal.nonce} signatures={dbData ? dbData.signatures : null} signers={dbData ? dbData.signers : null} transactionHash={proposal.transactionHash} user={user} timeStamp={proposal.proposedAt} />
        )}
        {!isHolder && votesReceived < (votesNeededPercentage) / 10 ** 2 && (
            <button className='text-white text-md  lg:text-xl m-2 bg-amber-400 rounded-3xl px-2 py-1'>Stake</button>
        )}
    </div>
    )
}

export default DAOButtonSelection
