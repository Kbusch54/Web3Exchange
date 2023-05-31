'use client'
import { supabase } from '../../../supabase';
import React, { useEffect, useState } from 'react'
import { useContractWrite, Address, useSigner } from 'wagmi';
import { useExecuteProposal } from '../../../utils/contractWrites/daos/ariadne/execute';

interface Props {
  callData: string,
  user: Address,
  disabled: boolean,
  signatures: string[],
  nonce: number,
  addressTo: Address,
  ariadneAdd: Address

}

export default function ExecuteProposalButton  ({ user, disabled, callData,nonce,addressTo,signatures,ariadneAdd }: Props) {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState(false);
  
  const { config, error } = useExecuteProposal(Number(nonce),addressTo,callData,signatures, ariadneAdd, user);

const updateDataBase = async (transacitonHash:string) => {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .update([{result:transacitonHash,isProposalPassed:true,executor:user}])
        .eq('contractNonce', ariadneAdd+'_'+Number(nonce));

    if (error) {
      console.error('Error adding proposal:', error);
    } else {
      console.log('Proposal added successfully');
    }
  } catch (error) {
    console.error('Error adding proposal:', error);
  }
}

console.log('config for ariadne execute', config);
const contractWrite = useContractWrite(config);
useEffect(() => {
  if (error == null) {
    setErrorWithContractLoad(false);
  } else {
    setErrorWithContractLoad(true);
  }
}, [error]);
useEffect(() => {
//   console.log('NONCE', nonce);
}, [approved,nonce]);


//@ts-ignore
const handleWrite = async (e) => {
  e.preventDefault();
  setLoadingStage((prev) => true);
  console.log('contractWrite ddd',contractWrite);
  //@ts-ignore
  await contractWrite.writeAsync()
    .then((con: { wait: (arg0: number) => Promise<any>; hash: any; }) => {
      con.wait(1).then((res) => {
        if (contractWrite.isSuccess || res.status == 1) {
          console.log(res.transactionHash);
          console.log('res', res);
          updateDataBase(res.transactionHash)
          setLoadingStage((prev) => false);
          setApproved(true);
          //custom message
          //notification
          //ask for signature
          //wait for signature
          //refresh page?? 
        } else if (
          contractWrite.status == "idle" ||
          contractWrite.status == "error" ||
          contractWrite.isIdle == true ||
          res.status == 0
          ) {
            console.log('error se', res);
          console.log("error see traNSACITON HASH", con.hash);
          console.log(contractWrite?.error);
          console.log(contractWrite?.error?.message);
        } else {
          console.log("error see traNSACITON HASH", con.hash);
          console.log(contractWrite?.error?.message);
        }
      });
    })
    .catch((err: any) => {
      console.log("didnt event fire", err);
    });
};


  if (contractWrite.isLoading || loadingStage)
    return (
      <div className="px-2 py-1 rounded-lg bg-teal-400 text-white">
        Processing…
      </div>
    );
  if (errorWithContractLoad)
    return (
      <div className=" px-2 py-1 rounded-lg bg-red-600 text-white animate-pulse">
        <p className='text-xs md:text-md lg:text-lg'>
          Error With current transaciton…
        </p>
      </div>
    );
  if (approved)
    return (
      <button disabled className=" px-2 py-1 rounded-lg bg-green-600 text-white animate-pulse text-xs md:text-md lg:text-lg">
        Success
      </button>
    );

  return (
    <div className={`${approved?'hidden':'block'}`}>
      <button disabled={disabled} onClick={handleWrite} className='bg-amber-500 px-2 py-1  rounded-2xl text-white text-lg hover:scale-125'>Execute</button>
    </div>
  )
  
}
