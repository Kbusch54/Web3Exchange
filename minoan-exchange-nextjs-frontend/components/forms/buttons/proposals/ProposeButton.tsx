'use client'
import { supabase } from '../../../../supabase';
import React, { useEffect, useState } from 'react'
import { useContractWrite, Address, useWaitForTransaction, useAccount  }  from 'wagmi';
import { useNewProposal } from '../../../../utils/contractWrites/daos/ariadne/purpose';
import { ethers } from 'ethers';
import { getTransactionHash } from '../../../../utils/helpers/doas';
import { theseus } from '../../../../utils/address';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

interface Props {
  callData: string,
  user: Address,
  disabled: boolean
  description: string,
  nonce: number,
  contractAddress: Address,
  addressTo: Address,
  option?: string

}

export default function ProposeButton  ({ user, disabled, callData, addressTo, description,nonce,contractAddress,option }: Props) {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState(false);
  const [usedNonce, setUsedNonce] = useState<number|null>(null);
  const [etherscanTransactionHash, setEtherscanTransactionHash] = useState<string|null>(null);
  const [transactionHash, setTransactionHash] = useState<string|null>(null);   
  const [customMessage, setCustomMessage] = useState<string|null>(null);

  
  const { config, error } = useNewProposal(addressTo,callData, contractAddress, user,option);
  const { connector } = useAccount()
  //@ts-ignore
  const hanldeSign = async (e) => {
    e.preventDefault();
    //@ts-ignore
    if (!transactionHash) {
      alert('no transaction hash')
    } else { 
    const provider = await connector?.getProvider()
console.log('connector',connector)
const signature = await provider.send("personal_sign", [transactionHash, user])
      if (signature.result  ) {
      const verified = ethers.utils.verifyMessage(
       ethers.utils.arrayify(transactionHash),
        signature.result
      );
        if (verified.toLowerCase() == user.toLowerCase()) {
        await updateDataBase(signature.result,transactionHash);
      }else{
        alert('not verified');
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
      .insert([ {contractAddress:contractAddress,contractNonce:contractAddress+'_'+Number(usedNonce),etherscanTransactionHash:etherscanTransactionHash,proposer:user,nonce:Number(usedNonce), to:addressTo, transactionHashToSign:transacitonHash, executor:null, signatures:[signature], timeStamp:Date.now(), isProposalPassed:false, description:description, result:null, signers:[user]} ]);

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
useEffect(() => {
  if(transactionHash == null && usedNonce !=null){
    const txHash = getTransactionHash(usedNonce,addressTo,0,callData,contractAddress);
    console.log('txHash',txHash);
    setTransactionHash(prev=>txHash);
  }
}, [usedNonce]);
const { data, isError, isLoading,isSuccess } = useWaitForTransaction({
  hash: contractWrite.data?.hash,
})
useEffect(() => {
    if (error == null) {
      setErrorWithContractLoad(false);
    } else {
      setErrorWithContractLoad(true);
    }
  }, [error]);
  useEffect(() => {
    if(data){
     
      if ( data.status == 'success'|| contractWrite.status == 'success') {
        console.log(data.transactionHash);
        contractWrite.reset();
        setLoadingStage((prev) => false);
        //custom message for 3 seconds then reset
        setEtherscanTransactionHash((prev)=>data.transactionHash);
        //update db 
        setLoadingStage((prev) => false);
        setApproved(true);
        toast.success(`Transaction Sent ${data.transactionHash}`, {  duration: 6000 });
        setCustomMessage('Success');
       }
        } 
        else if (
          contractWrite.status == "idle" ||
          contractWrite.status == "error" ||
          contractWrite.isIdle == true 
        ) {
          console.log("error see traNSACITON HASH", error);
          console.log(contractWrite?.error?.message);
        } else {
          console.log("error see traNSACITON HASH", isError);
          console.log(contractWrite?.error?.message);
          toast.error(`Transaction Failed ${contractWrite.data?.hash}`, {  duration: 6000 });
          console.log("error see traNSACITON HASH", contractWrite.data?.hash);
          console.log(contractWrite?.error?.message);
        }
        },[data]);
          


   //@ts-ignore
   const handleWrite = async (e) => {
    e.preventDefault();
    setLoadingStage((prev) => true);
    // await contractWrite.writeAsync()
    setUsedNonce((prev)=>nonce);
    //@ts-ignore
    
    // console.log('contractWrite',contractWrite);
     await contractWrite.writeAsync().then(con=>{

        }).catch((err: any) => {
        console.log("didnt event fire", err);
        if(err.message.includes('User rejected request')){
          console.log('user rejected');
          contractWrite.reset();
          setLoadingStage((prev) => false);
          //error isContractError for 3 seconds then reset
          setErrorWithContractLoad(true);
          setCustomMessage('User rejected request');
          setTimeout(() => {
            setErrorWithContractLoad(false);
            setCustomMessage(null);
          }
          , 3000);
        };
        console.log("didnt event fire", err);
        console.log('message',err.message);
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

  return (
    <div className={`${approved?'hidden':'block'}`}>
      <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 bg-amber-500 rounded-2xl text-white text-lg hover:scale-125'>Propose</button>
    </div>
  )
  
}
