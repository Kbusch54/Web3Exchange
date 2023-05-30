'use client'
import { supabase } from '../../../supabase';
import React, { useEffect, useState } from 'react'
import { useContractWrite, Address, useSigner } from 'wagmi';
import { useNewProposal } from '../../../utils/contractWrites/daos/ariadne/purpose';
import { ethers } from 'ethers';
import { getAriadnePool, getTransactionHash } from '../../../utils/helpers/doas';
import { loanpool } from '../../../utils/address';

interface Props {
  callData: string,
  user: Address,
  disabled: boolean
  ammId: string,
  description: string,
  nonce: number,
  internal: boolean

}

export default function AriadnePurposeButton  ({ user, disabled, callData, ammId, description,nonce,internal }: Props) {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState(false);
  const [usedNonce, setUsedNonce] = useState<number|null>(null);
  const [etherscanTransactionHash, setEtherscanTransactionHash] = useState<string|null>(null);
  
  
  
  const ammAdd = getAriadnePool(ammId);
  const addressTo = internal?ammAdd:loanpool;
  const { config, error } = useNewProposal(addressTo,callData, ammId, user);
    const transacitonHash = getTransactionHash(nonce,addressTo,0,callData,ammAdd);
  const { data: signer, isError, isLoading } = useSigner();
  //@ts-ignore
  const hanldeSign = async (e) => {
    e.preventDefault();
    if (!transacitonHash) {
      alert('no transaction hash')
    } else { 
    const signature = await signer
      ?.signMessage(ethers.utils.arrayify(transacitonHash))
      .catch((err: Error) => {
        alert(err);
      });

    if (signature) {
      const verified = ethers.utils.verifyMessage(
        ethers.utils.arrayify(transacitonHash),
        signature
      );
      console.log('is verified', verified);
      if (verified == user) {
        await updateDataBase(signature,transacitonHash);
      }
    }
  }
};
const updateDataBase = async (signature:string,transacitonHash:string) => {
  if(!usedNonce) return console.log('no nonce');
  else{

  
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .insert([ {contractAddress:ammAdd,contractNonce:ammAdd+'_'+Number(usedNonce),etherscanTransactionHash:etherscanTransactionHash,proposer:user,nonce:Number(usedNonce), to:loanpool, transactionHashToSign:transacitonHash, executor:null, signatures:[signature], timeStamp:Date.now(), isProposalPassed:false, description:description, result:null, signers:[user]} ]);

    if (error) {
      console.error('Error adding proposal:', error);
    } else {
      console.log('Proposal added successfully');
    }
  } catch (error) {
    console.error('Error adding proposal:', error);
  }
}
}

console.log('config for ariadne', config);
const contractWrite = useContractWrite(config);
useEffect(() => {
  if (error == null) {
    setErrorWithContractLoad(false);
  } else {
    setErrorWithContractLoad(true);
  }
}, [error]);
useEffect(() => {
  console.log('NONCE', nonce);
}, [approved,nonce]);


//@ts-ignore
const handleWrite = async (e) => {
  e.preventDefault();
  setLoadingStage((prev) => true);
  setUsedNonce((prev)=>nonce);
  console.log('contractWrite ddd',contractWrite);
  //@ts-ignore
  await contractWrite.writeAsync()
    .then((con: { wait: (arg0: number) => Promise<any>; hash: any; }) => {
      con.wait(1).then((res) => {
        if (contractWrite.isSuccess || res.status == 1) {
          console.log(res.transactionHash);
          setEtherscanTransactionHash((prev)=>res.transactionHash);
          console.log('res', res);
          //update db 
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
          console.log("error see traNSACITON HASH", con.hash);
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
      <button onClick={hanldeSign} className=" px-2 py-1 rounded-lg bg-green-600 text-white animate-pulse text-xs md:text-md lg:text-lg">
        Sign Transaction
      </button>
    );

  return (
    <div className={`${approved?'hidden':'block'}`}>
      <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 bg-amber-500 rounded-2xl text-white text-lg hover:scale-125'>Purpose</button>
    </div>
  )
  
}
