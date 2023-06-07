import React from 'react'
import { Address } from 'wagmi';
import { getAriadnePool} from '../../../utils/helpers/doas';

interface Props {
    userDAO: any;
    sybmol: string;
    user: Address;
    
}

const DAOStatsPersonal: React.FC<Props> = ({user,userDAO,sybmol}) => {
    const ammID = getAriadnePool(sybmol);
    const allData = userDAO?.filter((db:any)=>String(db.contractAddress).toLowerCase()=== String(ammID).toLowerCase());
    const totalProposed = allData?.filter((db:any)=>db.proposer.toLowerCase()===user.toLowerCase());
    const signaturesFound = allData?.filter((db:any)=>db.signers.find((sig:any)=>sig.toLowerCase()===user.toLowerCase())).length;
    const executedProposals = allData?.filter((db:any)=>db.executor!=null&&db.executor.toLowerCase()===user.toLowerCase()).length;
    const proposedPassed = totalProposed?.filter((db:any)=>db.isProposalPassed == true).length;
    return (
        <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-4 justify-center align-middle  mt-12 gap-y-6 gap-x-6 text-white">
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>{totalProposed?totalProposed.length:0}</h1>
                <h3>Proposals Proposed</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>{signaturesFound?signaturesFound:0}</h1>
                <h3>Proposals Signed</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>{executedProposals}</h1>
                <h3>Proposals Executed</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>{proposedPassed}</h1>
                <h3>Proposals Proposed Passed</h3>
            </div>
        </section>
    )
}

export default DAOStatsPersonal
