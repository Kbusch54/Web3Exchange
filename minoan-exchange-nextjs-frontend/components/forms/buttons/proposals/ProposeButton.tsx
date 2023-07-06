'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useContractWrite, Address, useWaitForTransaction, useAccount  }  from 'wagmi';
import { useNewProposal } from '../../../../utils/contractWrites/daos/ariadne/purpose';
import { ethers } from 'ethers';
import { getTransactionHash } from '../../../../utils/helpers/doas';
import toast from 'react-hot-toast';
import {useRouter } from 'next/navigation';
import { addProposal, addTransaction, upsertProposal } from '../helper/database';

interface Props {
  callData: string,
  user: Address,
  disabled: boolean
  description: string,
  nonce: number,
  contractAddress: Address,
  addressTo: Address,
  option?: string
  close: () => void

}

export default function ProposeButton  ({ user, disabled, callData, addressTo, description,nonce,contractAddress,option,close }: Props) {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState(false);
  const [loadingStageSign, setLoadingStageSign] = useState(false);
  const [usedNonce, setUsedNonce] = useState<number|null>(null);
  const [transactionHash, setTransactionHash] = useState<string|null>(null);   
  const [customMessage, setCustomMessage] = useState<string|null>(null);
  const isMounted = useRef(true);
  const router = useRouter();
  
  const { config, error } = useNewProposal(addressTo,callData, contractAddress, user,option);
  const { connector } = useAccount()
  
const contractWrite = useContractWrite(config);
const waiting = useWaitForTransaction({
  hash: contractWrite.data?.hash,
})
  useEffect(() => {
    if (isMounted.current) {
      if(waiting.isError){
        setLoadingStage((prev) => false);
        setErrorWithContractLoad((prev) => true);
        toast.error(`Error With Transaction ${waiting.error}`, {  duration: 6000 ,position:'top-right'});
        console.log('err',waiting.error);
        isMounted.current = false;
        setTimeout(() => {
          contractWrite.reset();
          isMounted.current = true;
        }, 10000);
      }else if(waiting.isSuccess && waiting.data){
        isMounted.current = false;
        toast.success(`Proposed ${description} `, {  duration: 6000 ,position:'top-right'});
        if(usedNonce && transactionHash){
          addProposal(contractAddress,usedNonce,user,addressTo,transactionHash,description,waiting.data.transactionHash).then((res)=>{
            console.log('res added transaction',res);
          })
          const date = new Date().toISOString().toLocaleString();
          addTransaction(waiting.data.transactionHash,user,date,'Added Proposal','proposal').then((res)=>{
            console.log('res added transaction',res);
          })
          setLoadingStage((prev) => false);
          setApproved(prev=>true)
        }
      
          
      }
  }
    return () => {
    }
  }, [waiting])
  //@ts-ignore
  const hanldeSign = async (e) => {
    e.preventDefault();
    setLoadingStageSign((prev) => true);

    //@ts-ignore
    if (!transactionHash) {
      alert('no transaction hash')
    } else { 
    const provider = await connector?.getProvider()
const signature = await provider.send("personal_sign", [transactionHash, user])
      if (signature.result) {
      const verified = ethers.utils.verifyMessage(
       ethers.utils.arrayify(transactionHash),
        signature.result
      );
        if (verified.toLowerCase() == user.toLowerCase()) {
          if(usedNonce ){
            await upsertProposal(contractAddress,usedNonce,user,signature.result).then((res)=>{
            toast.success(`Signed proposal ${usedNonce} `, {  duration: 6000 ,position:'top-right'});
            const date = new Date().toISOString().toLocaleString();
            addTransaction(transactionHash,user,date,'Signed Proposal','proposal').then((res)=>{
              console.log('res added transaction',res);
            })
            setTimeout(() => {
              setApproved(prev=>false)
              contractWrite.reset();
              router.refresh();
              close();
            }, 6000);
            })
        }
        }else{
          alert('not verified');
          setCustomMessage(prev=>'Not verified');
        }
    }
  }
};


useEffect(() => {
  if (error == null) {
    setErrorWithContractLoad(false);
  } else {
    setErrorWithContractLoad(true);
  }
}, [error]);


    


  
          


   //@ts-ignore
   const handleWrite = async (e) => {
    e.preventDefault();
    // await contractWrite.writeAsync()
    setUsedNonce((prev)=>nonce);
    console.log('nonce from contract write',nonce);
    const txHash = getTransactionHash(nonce,addressTo,0,callData,contractAddress);
    setTransactionHash(prev=>txHash);
    setLoadingStage((prev) => true);
    //@ts-ignore
    await contractWrite.writeAsync().then((res) => {
    })
    .catch((err) => {
      console.log('err',err);
      setLoadingStage((prev) => false);
      setErrorWithContractLoad((prev) => true);
      toast.error(`Error With Transaction ${err.details}`, {  duration: 6000 ,position:'top-right'});
      setTimeout(() => {
        setErrorWithContractLoad((prev) => false);
        contractWrite.reset();
      }, 10000);
    });

     
  };
  if (contractWrite.isLoading || loadingStage)
  return (
    <div className="px-2 py-1 rounded-2xl mt-4 font-extrabold bg-teal-400 text-white">
      Processing…
    </div>
  );
if (errorWithContractLoad)
  return (
    <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-red-600 text-white animate-pulse">
      {customMessage? (
        <p>{customMessage}</p>
      ):(
        <p>Error With current transaciton…</p>
      )}
    </div>
  );

  if (approved)
    return (
      <button onClick={hanldeSign} className=" px-2 py-1 rounded-lg bg-green-600 text-white animate-pulse text-xs md:text-md lg:text-lg">
        Sign Transaction
      </button>
    );
    if(loadingStageSign&&approved){
      return (
        <div className="px-2 py-1 rounded-2xl mt-4 font-extrabold bg-teal-400 text-white">
          Signed....
        </div>
      );
    }

  return (
    <div className={`${approved?'hidden':'block'}`}>
      <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 bg-amber-500 rounded-2xl text-white text-lg hover:scale-125'>Propose</button>
    </div>
  )
  
}
